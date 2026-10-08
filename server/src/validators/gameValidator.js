const { z } = require('zod');

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Must be a valid ObjectId');
const nonEmpty = (max) => z.string().trim().min(1, 'Required').max(max);

const createGameSchema = z.object({
  sport: z.enum(['Football', 'Cricket', 'Basketball', 'Volleyball', 'Badminton', 'Tennis']),
  title: nonEmpty(80),
  venue: nonEmpty(120),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([
      z.number().min(-180).max(180), // Longitude
      z.number().min(-90).max(90)    // Latitude
    ])
  }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Must be HH:MM'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Must be HH:MM'),
  skillLevel: z.enum(['Casual', 'Intermediate', 'Competitive']),
  maxPlayers: z.number().int().min(2).max(50),
  // hostId is intentionally absent: it is derived from the verified token.
}).strict();

const chatSchema = z.object({
  prompt: nonEmpty(2000),
}).strict();

const createInvitationSchema = z.object({
  gameId: objectId,
  playerId: objectId,
  // senderId is intentionally absent: it is derived from the verified token.
}).strict();

const attendanceSchema = z.object({
  gameId: objectId,
  event: z.enum(['ATTENDED', 'NO_SHOW', 'LEFT_EARLY']),
  // userId is intentionally absent: it is derived from the verified token.
}).strict();

// PUT /api/games/:id/attendance
const markAttendanceSchema = z.object({
  playerId: objectId,
  status: z.enum(['present', 'flaked']),
}).strict();

// POST /api/games/:id/review
const reviewGameSchema = z.object({
  attendance: z.array(
    z.object({
      userId: objectId,
      attended: z.boolean(),
    })
  ).min(1, 'At least one attendance entry is required'),
}).strict();

module.exports = {
  createGameSchema,
  chatSchema,
  createInvitationSchema,
  attendanceSchema,
  markAttendanceSchema,
  reviewGameSchema,
};
