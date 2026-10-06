require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../data/models/User');
const Game = require('../data/models/Game');
const logger = require('../utils/logger');

const SPORT_PLAN = [
  { sport: 'Football', count: 34, maxPlayers: [11, 14, 16, 18] },
  { sport: 'Cricket', count: 28, maxPlayers: [11, 18, 22] },
  { sport: 'Basketball', count: 19, maxPlayers: [8, 10, 12] },
  { sport: 'Badminton', count: 12, maxPlayers: [2, 4, 6] },
  { sport: 'Tennis', count: 8, maxPlayers: [2, 4] },
];

const VENUES = [
  { name: 'Salt Lake Turf', coordinates: [88.4000, 22.5800] },
  { name: 'Maidan Grounds', coordinates: [88.3600, 22.5580] },
  { name: 'Netaji Indoor Stadium', coordinates: [88.3430, 22.5580] },
  { name: 'Eco Park Arena', coordinates: [88.4400, 22.6000] },
  { name: 'Rabindra Sarobar Turf', coordinates: [88.3630, 22.5120] },
  { name: 'Kolkata Football Academy', coordinates: [88.3150, 22.6900] },
  { name: 'Dhak Stadium', coordinates: [88.4500, 22.5700] },
  { name: 'Howrah Maidan', coordinates: [88.2630, 22.5950] },
  { name: 'New Town Sports Complex', coordinates: [88.4700, 22.5800] },
  { name: 'Garia Sports Hub', coordinates: [88.4300, 22.4600] },
  { name: 'Behala Turf Park', coordinates: [88.2100, 22.4900] },
  { name: 'Alipore Cricket Ground', coordinates: [88.2800, 22.5300] },
];

const TITLE_PREFIX = {
  Football: ['Sunday Morning', 'Midweek', 'Sunset', 'Early Bird', 'Evening', 'Gully', 'Open', 'Casual'],
  Cricket: ['Cricket Net', 'Gully', 'Box Cricket', 'Weekend', 'Practice', 'Gully Kings', 'Underarm', 'Tape Ball'],
  Basketball: ['Casual Hoops', 'Street', 'Pick-up', 'Sunset', 'Open Run', '3x3', 'Morning', 'Court'],
  Badminton: ['Badminton Smash', 'Doubles', 'Casual', 'Morning', 'Evening', 'Rally', 'Feather', 'Court'],
  Tennis: ['Tennis Rally', 'Baseline', 'Serve & volley', 'Casual', 'Morning', 'Doubles', 'Open', 'Court'],
};

const TITLE_SUFFIX = {
  Football: ['7v7', '5v5', '11v11', 'Small Sides', 'Turf Match', 'Friendly'],
  Cricket: ['Practice', 'Blitz', 'T20', 'Box Cricket', 'Net Session', 'Friendly'],
  Basketball: ['Pick-up', 'Run', 'Hoops', 'Shootaround', '5v5', 'Drop-in'],
  Badminton: ['Smash', 'Doubles', 'Singles', 'Drills', 'Casual', 'Matchplay'],
  Tennis: ['Rally', 'Doubles', 'Singles', 'Baseline Drills', 'Casual', 'Matchplay'],
};

const SKILL_LEVELS = ['Casual', 'Intermediate', 'Competitive'];
const SLOT_TIMES = ['06:00', '07:00', '08:30', '10:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const buildTitle = (sport) => `${pick(TITLE_PREFIX[sport])} ${pick(TITLE_SUFFIX[sport])}`;

const buildDates = () => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, offset) => {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    return d.toISOString().split('T')[0];
  });
};

const buildEndTime = (startTime) => {
  const [h, m] = startTime.split(':').map(Number);
  const end = (h + 2) % 24;
  return `${String(end).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const resolveHost = async () => {
  const existing = await User.findOne();
  if (existing) return existing._id;

  const host = await User.create({
    name: 'SquadUp Seeder',
    username: 'squadup_seeder',
    sports: ['Football', 'Cricket', 'Basketball', 'Badminton', 'Tennis'],
    skillLevels: { Football: 'Competitive' },
    location: { type: 'Point', coordinates: [88.4000, 22.5800] },
  });
  return host._id;
};

const seedGames = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('[seedGames] Connected to MongoDB');

    await Game.deleteMany({});
    logger.info('[seedGames] Cleared existing games collection');

    const hostId = await resolveHost();
    const dates = buildDates();

    const games = SPORT_PLAN.flatMap(({ sport, count, maxPlayers }) =>
      Array.from({ length: count }, () => {
        const venue = pick(VENUES);
        const max = pick(maxPlayers);
        const joined = randomInt(2, Math.max(2, max - 1));
        const startTime = pick(SLOT_TIMES);

        return {
          hostId,
          sport,
          title: buildTitle(sport),
          venue: venue.name,
          location: { type: 'Point', coordinates: venue.coordinates },
          date: pick(dates),
          startTime,
          endTime: buildEndTime(startTime),
          skillLevel: pick(SKILL_LEVELS),
          maxPlayers: max,
          players: [hostId],
          openSlots: max - joined,
          status: 'OPEN',
          seeded: true,
        };
      })
    );

    const inserted = await Game.insertMany(games);
    logger.info(`Seeded ${inserted.length} games`);
    SPORT_PLAN.forEach(({ sport, count }) => logger.info(`   - ${sport}: ${count}`));
    logger.info('Database seeding completed successfully!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    logger.error(`[seedGames] Seeding failed: ${err.message}`);
    process.exit(1);
  }
};

seedGames();
