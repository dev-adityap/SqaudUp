const { z } = require('zod');

const createGameSchema = z.object({
  hostId: z.string().min(1, 'Host ID is required'),
  sport: z.enum(['Football', 'Cricket', 'Basketball', 'Volleyball', 'Badminton', 'Tennis']),
  title: z.string().min(3).max(50),
  venue: z.string().min(3),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([
      z.number().min(-180).max(180), // Longitude
      z.number().min(-90).max(90)    // Latitude
    ])
  }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Must be HH:MM'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Must be HH:MM'),
  skillLevel: z.enum(['Casual', 'Intermediate', 'Competitive']),
  maxPlayers: z.number().int().min(2).max(50),
});

module.exports = { createGameSchema };