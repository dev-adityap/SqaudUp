require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../data/models/User');
const Game = require('../data/models/Game');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas...');

    // Clear existing data
   await mongoose.connection.db.dropDatabase();

    // Insert your squad
    const users = await User.insertMany([
      { name: 'Tanuj Saha', username: 'tanuj_playmaker', sports: ['Football'], skillLevels: { Football: 'Advanced' }, location: { type: 'Point', coordinates: [88.4000, 22.5800] }, reliabilityScore: 98, gamesPlayed: 54 },
      { name: 'Biki Debnath', username: 'biki_smash', sports: ['Badminton', 'Football'], skillLevels: { Badminton: 'Intermediate', Football: 'Casual' }, location: { type: 'Point', coordinates: [88.4100, 22.5850] }, reliabilityScore: 95, gamesPlayed: 32 },
      { name: 'Aditya Panna', username: 'aditya_core', sports: ['Football', 'Cricket'], skillLevels: { Football: 'Competitive' }, location: { type: 'Point', coordinates: [88.3900, 22.5750] }, reliabilityScore: 99, gamesPlayed: 41 },
      { name: 'Souvik Das', username: 'souvik_cricket', sports: ['Cricket'], skillLevels: { Cricket: 'Intermediate' }, location: { type: 'Point', coordinates: [88.4500, 22.6000] }, reliabilityScore: 92, gamesPlayed: 18 }
    ]);

    console.log('\n✅ Database Seeded Successfully!');
    console.log('⚠️ IMPORTANT: Copy these new ObjectIds to use in Postman:\n');
    users.forEach(u => console.log(`${u.name}: ${u._id}`));
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();