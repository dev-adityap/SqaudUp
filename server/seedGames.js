require('dotenv').config();
const mongoose = require('mongoose');
const Game = require('./src/data/models/Game'); 

// Valid 24-character hex strings for MongoDB ObjectIds
const mockHostId = "6ab58ca68499bc90e34bf5c6"; 
const mockUser2  = "5ab58ca68499bc90e34bf5c2";
const mockUser3  = "5ab58ca68499bc90e34bf5c3";
const mockUser4  = "5ab58ca68499bc90e34bf5c4";

const seedGames = [
  {
    title: "Salt Lake 7v7 Showdown", sport: "Football", venue: "Salt Lake Turf",
    skillLevel: "Intermediate", maxPlayers: 14, players: [mockHostId, mockUser2, mockUser3],
    date: "2026-09-28", startTime: "18:00", endTime: "19:30",
    location: { type: "Point", coordinates: [88.4232, 22.5801] },
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Sunday Morning Cricket", sport: "Cricket", venue: "Maidan Grounds",
    skillLevel: "Casual", maxPlayers: 22, players: [mockHostId],
    date: "2026-09-29", startTime: "07:00", endTime: "11:00",
    location: { type: "Point", coordinates: [88.3475, 22.5516] },
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Indoor Hoops - Pick Up", sport: "Basketball", venue: "Netaji Indoor Stadium",
    skillLevel: "Intermediate", maxPlayers: 10, players: [mockHostId, mockUser4],
    date: "2026-09-30", startTime: "19:00", endTime: "21:00",
    location: { type: "Point", coordinates: [88.3378, 22.5695] },
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Evening Badminton Doubles", sport: "Badminton", venue: "Racket Club Kolkata",
    skillLevel: "Intermediate", maxPlayers: 4, players: [mockHostId],
    date: "2026-10-01", startTime: "17:00", endTime: "19:00",
    location: { type: "Point", coordinates: [88.3639, 22.5354] },
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Casual Volleyball at the Park", sport: "Volleyball", venue: "Eco Park Arena",
    skillLevel: "Casual", maxPlayers: 12, players: [mockHostId, mockUser2, mockUser3, mockUser4],
    date: "2026-10-02", startTime: "16:30", endTime: "18:30",
    location: { type: "Point", coordinates: [88.4658, 22.6167] },
    image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Aditya's Tennis Singles", sport: "Tennis", venue: "South Club",
    skillLevel: "Intermediate", maxPlayers: 2, players: [mockHostId],
    date: "2026-10-03", startTime: "08:00", endTime: "10:00",
    location: { type: "Point", coordinates: [88.3533, 22.5385] },
    image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Late Night Futsal", sport: "Football", venue: "Action Area 1 Turf",
    skillLevel: "Intermediate", maxPlayers: 10, players: [mockHostId],
    date: "2026-10-03", startTime: "22:00", endTime: "23:30",
    location: { type: "Point", coordinates: [88.4682, 22.5804] },
    image: "https://images.unsplash.com/photo-1518605368461-1e1e38ce8058?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Beginners Cricket Net Session", sport: "Cricket", venue: "Eden Gardens Outer Nets",
    skillLevel: "Casual", maxPlayers: 8, players: [mockUser2, mockUser3],
    date: "2026-10-04", startTime: "15:00", endTime: "17:00",
    location: { type: "Point", coordinates: [88.3433, 22.5646] },
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop"
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB Atlas!");
    
    // Dynamically calculate openSlots to pass schema validation
    const finalGames = seedGames.map(g => ({
      ...g,
      hostId: mockHostId,
      openSlots: g.maxPlayers - g.players.length
    }));

    const result = await Game.insertMany(finalGames);
    console.log(`Successfully seeded ${result.length} games into the database!`);
    
    mongoose.connection.close();
    process.exit(0);
  })
  .catch(err => {
    console.error("Database connection error:", err);
    process.exit(1);
  });