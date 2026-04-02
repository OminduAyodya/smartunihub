require('dotenv').config();
const mongoose = require('mongoose');

// Set a connection timeout
const connectionTimeout = setTimeout(() => {
  console.error('❌ MongoDB connection timeout. Is MongoDB running?');
  process.exit(1);
}, 5000);

const User = require('./models/User');
const Event = require('./models/Event');
const Gallery = require('./models/Gallery');
const bcryptjs = require('bcryptjs');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventbooking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  clearTimeout(connectionTimeout);
  console.log('✓ MongoDB connected');
  seedDatabase();
})
.catch((error) => {
  clearTimeout(connectionTimeout);
  console.error('❌ MongoDB connection error:', error.message);
  process.exit(1);
});

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing sample data
    await Event.deleteMany({ description: { $regex: 'Sample Event' } });
    await Gallery.deleteMany({});
    await User.deleteMany({ email: { $in: ['organizer1@example.com', 'organizer2@example.com'] } });
    console.log('✓ Cleaned up existing sample data');

    // Create sample users (event organizers)
    const hashedPassword1 = await bcryptjs.hash('password123', 10);
    const hashedPassword2 = await bcryptjs.hash('password123', 10);

    const user1 = await User.create({
      name: 'John Smith',
      email: 'organizer1@example.com',
      password: hashedPassword1,
      phone: '1234567890',
      role: 'user',
    });
    console.log('✓ Created user 1: John Smith');

    const user2 = await User.create({
      name: 'Sarah Johnson',
      email: 'organizer2@example.com',
      password: hashedPassword2,
      phone: '0987654321',
      role: 'user',
    });
    console.log('✓ Created user 2: Sarah Johnson');

    // Create past event 1
    const pastDate1 = new Date();
    pastDate1.setDate(pastDate1.getDate() - 30);
    
    const pastEndDate1 = new Date(pastDate1);
    pastEndDate1.setDate(pastEndDate1.getDate() + 2);

    const event1 = await Event.create({
      title: 'Music Festival 2025',
      description: 'Sample Event: An amazing music festival featuring local and international artists. Experience live performances, food stalls, and entertainment all day long!',
      startDate: pastDate1,
      endDate: pastEndDate1,
      venue: 'Central Park Arena, New York',
      location: 'New York, USA',
      eventType: 'outdoor',
      category: 'Music',
      eventOrganizer: user1._id,
      status: 'completed',
      totalSeats: 5000,
      thumbnail: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=500&fit=crop',
      approvedBy: user1._id,
    });
    console.log('✓ Created event 1: Music Festival 2025');

    // Add gallery images for event 1
    const images1 = [
      {
        event: event1._id,
        imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
        title: 'Crowd enjoying the opening performance',
        uploadedBy: user1._id,
      },
      {
        event: event1._id,
        imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=400&fit=crop',
        title: 'Main stage setup with amazing lighting',
        uploadedBy: user1._id,
      },
      {
        event: event1._id,
        imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
        title: 'Live performance by headliner band',
        uploadedBy: user1._id,
      },
      {
        event: event1._id,
        imageUrl: 'https://images.unsplash.com/photo-1498038432885-26ac89b75e8a?w=400&h=400&fit=crop',
        title: 'Festival attendees dancing and having fun',
        uploadedBy: user1._id,
      },
    ];

    await Gallery.insertMany(images1);
    console.log('✓ Added 4 gallery images for Music Festival');

    // Create past event 2
    const pastDate2 = new Date();
    pastDate2.setDate(pastDate2.getDate() - 15);
    
    const pastEndDate2 = new Date(pastDate2);
    pastEndDate2.setDate(pastEndDate2.getDate() + 1);

    const event2 = await Event.create({
      title: 'Tech Conference 2025',
      description: 'Sample Event: Join us for an exciting tech conference where industry leaders discuss innovations in AI, cloud computing, and software development. Network with thousands of tech professionals!',
      startDate: pastDate2,
      endDate: pastEndDate2,
      venue: 'Convention Center, San Francisco',
      location: 'San Francisco, USA',
      eventType: 'indoor',
      category: 'Conference',
      eventOrganizer: user2._id,
      status: 'completed',
      totalSeats: 2000,
      thumbnail: 'https://images.unsplash.com/photo-1540575467063-178f50002fe5?w=800&h=500&fit=crop',
      approvedBy: user2._id,
    });
    console.log('✓ Created event 2: Tech Conference 2025');

    // Add gallery images for event 2
    const images2 = [
      {
        event: event2._id,
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop',
        title: 'Keynote speaker delivering inspiring presentation',
        uploadedBy: user2._id,
      },
      {
        event: event2._id,
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop',
        title: 'Audience engaged and taking notes',
        uploadedBy: user2._id,
      },
      {
        event: event2._id,
        imageUrl: 'https://images.unsplash.com/photo-1591290621749-c306aaf3b237?w=400&h=400&fit=crop',
        title: 'Networking area with industry professionals',
        uploadedBy: user2._id,
      },
      {
        event: event2._id,
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop',
        title: 'Panel discussion on AI innovations',
        uploadedBy: user2._id,
      },
    ];

    await Gallery.insertMany(images2);
    console.log('✓ Added 4 gallery images for Tech Conference');

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\nSample Events Created:');
    console.log('1. Music Festival 2025 - 4 photos');
    console.log('2. Tech Conference 2025 - 4 photos');
    console.log('\nLogin credentials for sample organizers:');
    console.log('- organizer1@example.com / password123');
    console.log('- organizer2@example.com / password123');
    console.log('\nYou can now view these events in the Past Events page!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};
