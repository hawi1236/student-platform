const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const checkUsers = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error('MONGO_URI is not defined in .env');
    }
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    const users = await User.find({}, 'name email role');
    console.log('Registered Users:');
    console.log(JSON.stringify(users, null, 2));
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

checkUsers();
