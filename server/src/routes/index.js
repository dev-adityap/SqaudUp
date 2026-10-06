const express = require('express');
const router = express.Router();

const gameController = require('../controllers/gameController');
const matchController = require('../controllers/matchController');
const inviteController = require('../controllers/inviteController');
const notifController = require('../controllers/notifController');
const reliabilityController = require('../controllers/reliabilityController');
const aiController = require('../controllers/aiController');
const authController = require('../controllers/authController');

const { requireAuth } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { validateObjectIds } = require('../middleware/validateObjectId');
const { requireSelf } = require('../middleware/requireSelf');
const {
  createGameSchema,
  chatSchema,
  createInvitationSchema,
  invitationActionSchema,
  attendanceSchema,
  markAttendanceSchema,
} = require('../validators/gameValidator');

// Stricter budget for the AI endpoint: it is a paid, abusable resource.
const aiLimiter = require('express-rate-limit')({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many AI requests, slow down', code: 'RATE_LIMITED' },
});

// Health Check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'SqaudUp API running' });
});

// Links the verified Firebase identity to a Mongo user. Call once per session.
router.post('/auth/sync', requireAuth, authController.syncUser);

// Games
router.get('/games', gameController.getGames);
router.get('/games/:id', validateObjectIds('id'), gameController.getGameById);
router.post('/games', requireAuth, validate(createGameSchema), gameController.createGame);
router.post('/games/:id/join', requireAuth, validateObjectIds('id'), gameController.joinGame);
router.post('/games/:id/leave', requireAuth, validateObjectIds('id'), gameController.leaveGame);
router.put(
  '/games/:id/attendance',
  requireAuth,
  validateObjectIds('id'),
  validate(markAttendanceSchema),
  gameController.markAttendance
);

// Matchmaking
router.get('/matches/game/:gameId', requireAuth, validateObjectIds('gameId'), matchController.getMatchCandidates);

// Invitations
router.get('/invitations/user/:userId', requireAuth, validateObjectIds('userId'), requireSelf('userId'), inviteController.getUserInvitations);
router.post('/invitations', requireAuth, validate(createInvitationSchema), inviteController.createInvitation);
router.post('/invitations/:id/accept', requireAuth, validateObjectIds('id'), inviteController.acceptInvitation);
router.post('/invitations/:id/reject', requireAuth, validateObjectIds('id'), inviteController.rejectInvitation);

// Notifications
router.get('/notifications/:userId', requireAuth, validateObjectIds('userId'), requireSelf('userId'), notifController.getUserNotifications);
router.post('/notifications/:id/read', requireAuth, validateObjectIds('id'), notifController.markAsRead);

// Reliability
router.get('/reliability/:userId', requireAuth, validateObjectIds('userId'), requireSelf('userId'), reliabilityController.getReliabilityStats);
router.post('/reliability/attendance', requireAuth, validate(attendanceSchema), reliabilityController.logAttendance);

// AI Chat
router.post('/ai/chat', requireAuth, aiLimiter, validate(chatSchema), aiController.askGemini);

module.exports = router;
