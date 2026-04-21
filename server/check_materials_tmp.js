const mongoose = require('mongoose');
require('dotenv').config();
const Material = require('./models/Material');

const checkMaterials = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    const materials = await Material.find({}, 'title course');
    console.log('Materials in DB:');
    console.log(JSON.stringify(materials, null, 2));
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

checkMaterials();
