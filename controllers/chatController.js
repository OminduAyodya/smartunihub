const Chat = require('../models/Chat');
const Ride = require('../models/Ride');

// @desc    Get or create chat for a ride
// @route   GET /api/chats/ride/:rideId
const getChatByRide = async (req, res) => {
  try {
    const { rideId } = req.params;

    // Find existing chat
    let chat = await Chat.findOne({ ride: rideId })
      .populate('participants', '-password')
      .populate('messages.sender', '-password');

    if (!chat) {
      // Get ride to create new chat
      const ride = await Ride.findById(rideId)
        .populate('rider')
        .populate({
          path: 'driver',
          populate: { path: 'user' }
        });

      if (!ride) {
        return res.status(404).json({ message: 'Ride not found' });
      }

      // Create new chat
      const participants = [ride.rider._id];
      if (ride.driver?.user?._id) {
        participants.push(ride.driver.user._id);
      }

      chat = await Chat.create({
        ride: rideId,
        participants,
        messages: [{
          sender: ride.rider._id,
          content: 'Chat started for this ride',
          type: 'system'
        }]
      });

      chat = await Chat.findById(chat._id)
        .populate('participants', '-password')
        .populate('messages.sender', '-password');
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send message to chat
// @route   POST /api/chats/:chatId/messages
const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { senderId, content, type } = req.body;

    if (!senderId || !content) {
      return res.status(400).json({ message: 'Sender and content are required' });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (!chat.isActive) {
      return res.status(400).json({ message: 'Chat is no longer active' });
    }

    chat.messages.push({
      sender: senderId,
      content,
      type: type || 'text'
    });

    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate('participants', '-password')
      .populate('messages.sender', '-password');

    res.status(201).json(updatedChat.messages[updatedChat.messages.length - 1]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get chat messages
// @route   GET /api/chats/:chatId/messages
const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { limit = 50, before } = req.query;

    const chat = await Chat.findById(chatId)
      .populate('messages.sender', '-password');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    let messages = chat.messages;

    // Filter messages before a certain date if provided
    if (before) {
      messages = messages.filter(m => m.createdAt < new Date(before));
    }

    // Return latest messages
    messages = messages.slice(-parseInt(limit));

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark messages as read
// @route   PATCH /api/chats/:chatId/read
const markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Mark all messages from other users as read
    chat.messages.forEach(msg => {
      if (msg.sender.toString() !== userId && !msg.readAt) {
        msg.readAt = new Date();
      }
    });

    await chat.save();

    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Close chat
// @route   PATCH /api/chats/:chatId/close
const closeChat = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndUpdate(
      req.params.chatId,
      { isActive: false },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's active chats
// @route   GET /api/chats/user/:userId
const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({
      participants: userId,
      isActive: true
    })
      .populate('ride')
      .populate('participants', '-password')
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getChatByRide,
  sendMessage,
  getMessages,
  markAsRead,
  closeChat,
  getUserChats,
};
