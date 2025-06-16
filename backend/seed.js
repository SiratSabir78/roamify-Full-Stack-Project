// backend/seed.js
// This script connects to your MongoDB Atlas database and populates it with
// initial data for Cities and Users, respecting your schemas including password hashing.
// Run this script ONCE from your backend project's root directory: node seed.js

require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');
const City = require('./models/City'); // Import your City model (backend/models/City.js)
const User = require('./models/User'); // Import your User model (backend/models/User.js)

// Sample data for Cities
const citiesToSeed = [
  {
    name: 'Islamabad',
    places: ['Faisal Mosque', 'Daman-e-Koh', 'Rawal Lake'], // UPDATED
    description: 'The serene capital city of Pakistan, known for its lush greenery and peaceful environment.',
    images: ['https://placehold.co/600x400/FF0000/FFFFFF?text=Islamabad1', 'https://placehold.co/600x400/00FF00/000000?text=Islamabad2'],
    tripDates: [], // These are typically dynamic, user-selected for bookings
    numberOfPeople: 0, // This refers to capacity, not current travelers
    pricePerPerson: 15000, // Price per person, per day
    reviews: [],
  },
  {
    name: 'Lahore',
    places: ['Badshahi Mosque', 'Lahore Fort', 'Shalimar Gardens'], // UPDATED
    description: 'The cultural heart of Pakistan, famous for its historical sites, vibrant food scene, and beautiful gardens.',
    images: ['https://placehold.co/600x400/0000FF/FFFFFF?text=Lahore1', 'https://placehold.co/600x400/FFFF00/000000?text=Lahore2'],
    tripDates: [],
    numberOfPeople: 0,
    pricePerPerson: 14000,
    reviews: [],
  },
  {
    name: 'Karachi',
    places: ['Clifton Beach', 'Mazar-e-Quaid', 'Port Grand'], // UPDATED
    description: 'The bustling economic hub and largest city of Pakistan, offering a diverse urban experience and coastal views.',
    images: ['https://placehold.co/600x400/FFA500/FFFFFF?text=Karachi1', 'https://placehold.co/600x400/800080/FFFFFF?text=Karachi2'],
    tripDates: [],
    numberOfPeople: 0,
    pricePerPerson: 12000,
    reviews: [],
  },

];

// Sample data for Users, compatible with your User model (passwords will be hashed by pre-save hook)
const usersToSeed = [
  {
    username: 'testUserBooking',
    email: 'test.booking@gmail.com', // Must be a Gmail address as per your validation
    phone: '03331234567', // Valid Pakistani number
    address: '123 Fake St, Lahore, Pakistan', // Must include 'Pakistan'
    gender: 'male',
    password: 'password123', // This will be hashed by the User model's pre-save hook
    image: 'https://placehold.co/150x150/FF00FF/FFFFFF?text=User1',
    reviews: [],
    favouriteCities: [],
    citiesTravelled: [],
    questions: [],
    isAdmin: false,
  },
  {
    username: 'adminUser',
    email: 'admin.user@gmail.com',
    phone: '03009876543',
    address: '789 Admin Rd, Islamabad, Pakistan',
    gender: 'female',
    password: 'adminpassword', // This will also be hashed
    image: 'https://placehold.co/150x150/00FFFF/000000?text=Admin',
    reviews: [],
    favouriteCities: [],
    citiesTravelled: [],
    questions: [],
    isAdmin: true, // Example admin user
  },
];

const seedDB = async () => {
  try {
    // Connect to MongoDB Atlas using your MONGO_URI from .env
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected for seeding.');

    // Clear existing data in collections (USE WITH EXTREME CAUTION IN PRODUCTION!)
    // This wipes all current data in these collections.
    await City.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️ Existing cities and users cleared.');

    // Insert new data
    // Mongoose will automatically assign an _id (ObjectId) to each document
    // and hash passwords for users due to the pre-save hook.
    await City.insertMany(citiesToSeed);
    console.log('🌱 Cities seeded successfully!');

    const createdUsers = await User.insertMany(usersToSeed);
    console.log('🌱 Users seeded successfully!');

    // Log the ID of the first created user. This ID should be used in your frontend's
    // BookingsPage component (e.g., as the default `currentUserId` if no `loggedInUserId` prop is provided).
    if (createdUsers.length > 0) {
      console.log(`\n-------------------------------------------------`);
      console.log(`🔑 IMPORTANT: Use this User ID in your frontend's BookingsPage:`);
      console.log(`              ${createdUsers[0]._id}`);
      console.log(`              (You can log in with email: ${createdUsers[0].email}, password: ${usersToSeed[0].password})`);
      console.log(`-------------------------------------------------\n`);
    }

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
  }
};

seedDB();
