const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const FoodItem = require("../models/FoodItem");
const FoodRequest = require("../models/FoodRequest");

dotenv.config();

const users = [
  { name: "Ayesha Perera", email: "ayesha@student.smartunihub.com", role: "student" },
  { name: "Nimal Fernando", email: "nimal@student.smartunihub.com", role: "student" },
  { name: "Kavindu Silva", email: "kavindu@student.smartunihub.com", role: "student" },
];

const foods = [
  {
    name: "Chicken Kottu",
    price: 650,
    inStock: true,
    image: "https://images.unsplash.com/photo-1562967916-eb82221dfb36?w=800&q=80",
  },
  {
    name: "Veg Rice",
    price: 420,
    inStock: true,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80",
  },
  {
    name: "Egg Sandwich",
    price: 250,
    inStock: true,
    image: "https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?w=800&q=80",
  },
  {
    name: "Iced Coffee",
    price: 300,
    inStock: false,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
  },
  {
    name: "Fruit Bowl",
    price: 350,
    inStock: true,
    image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&q=80",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("Connected to database");

    await User.deleteMany({});
    console.log("Users cleared");

    await FoodItem.deleteMany({});
    console.log("Foods cleared");

    await FoodRequest.deleteMany({});
    console.log("Requests cleared");

    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);

    const createdFoods = await FoodItem.insertMany(foods);
    console.log(`Created ${createdFoods.length} foods`);

    console.log("✅ Seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seedDatabase();

