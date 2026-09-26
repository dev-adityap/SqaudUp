const express = require('express');
const router = express.Router();

const gameController = require('../controllers/gameController');
const matchController = require('../controllers/matchController');
const inviteController = require('../controllers/inviteController');
const notifController = require('../controllers/notifController');
const reliabilityController = require('../controllers/reliabilityController');
// Add this near your other controller imports at the top
const aiController = require('../controllers/aiController');

// Add this route anywhere in the file
// AI Chat
router.post('/ai/chat', aiController.askGemini);

// Health Check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'SqaudUp API running' });
});

// Games
router.get('/games', gameController.getGames);
router.get('/games/:id', gameController.getGameById);
router.post('/games', gameController.createGame);
router.post('/games/:id/join', gameController.joinGame);
router.post('/games/:id/leave', gameController.leaveGame);

// Matchmaking
router.get('/matches/game/:gameId', matchController.getMatchCandidates);

// Invitations
router.get('/invitations/user/:userId', inviteController.getUserInvitations);
router.post('/invitations', inviteController.createInvitation);
router.post('/invitations/:id/accept', inviteController.acceptInvitation);
router.post('/invitations/:id/reject', inviteController.rejectInvitation);

// Notifications
router.get('/notifications/:userId', notifController.getUserNotifications);
router.post('/notifications/:id/read', notifController.markAsRead);

// Reliability
router.get('/reliability/:userId', reliabilityController.getReliabilityStats);
router.post('/reliability/attendance', reliabilityController.logAttendance);
router.post('/ai/chat', aiController.askGemini);

module.exports = router;