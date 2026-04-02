// ============================================================
// Admin Seeder Script
// Run: node seedAdmin.js
// ============================================================

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');

// Admin credentials
const ADMIN_DATA = {
    name: 'System Admin',
    studentId: 'ADMIN001',
    email: 'admin@sliit.lk',
    password: 'admin123',
    phone: '0112345678',
    role: 'admin',
    isVerified: true,
    isActive: true
};

async function seedAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: ADMIN_DATA.email });

        if (existingAdmin) {
            console.log('\n========================================');
            console.log('Admin user already exists!');
            console.log('========================================');
            console.log('Email:', ADMIN_DATA.email);
            console.log('Password:', ADMIN_DATA.password);
            console.log('========================================\n');
        } else {
            // Create admin user
            const admin = await User.create(ADMIN_DATA);
            console.log('\n========================================');
            console.log('Admin user created successfully!');
            console.log('========================================');
            console.log('Email:', ADMIN_DATA.email);
            console.log('Password:', ADMIN_DATA.password);
            console.log('========================================\n');
        }

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error.message);
        process.exit(1);
    }
}

seedAdmin();
