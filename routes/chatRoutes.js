const express = require('express');
const router = express.Router();
const {
  getChatByRide,
  sendMessage,
  getMessages,
  markAsRead,
  closeChat,
  getUserChats,
} = require('../controllers/chatController');

router.get('/ride/:rideId', getChatByRide);
router.get('/user/:userId', getUserChats);
router.route('/:chatId/messages').get(getMessages).post(sendMessage);
router.patch('/:chatId/read', markAsRead);
router.patch('/:chatId/close', closeChat);

module.exports = router;
