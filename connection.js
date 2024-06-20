require('dotenv').config();
const mongoose = require('mongoose');

async function connectDB() {
  const URI = process.env.URI; // Declare URI in your .env file

  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to database with Mongoose");
  } catch (error) {
    console.error("Error connecting to the database", error);
    throw new Error('Unable to Connect to Database');
  }
}

module.exports = connectDB;
