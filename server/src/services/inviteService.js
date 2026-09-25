const createError = require('http-errors');
const inviteRepo = require('../repositories/memory/inviteRepository');
const gameRepo = require('../repositories/memory/gameRepository');
const gameService = require('./gameService');
const notifService = require('./notifService');

class InviteService {
  async getUserInvitations(userId) { 
    return await inviteRepo.findByUser(userId); 
  }

  async createInvitation(gameId, senderId, playerId) {
    const game = await gameRepo.findById(gameId);
    if (!game) throw createError(404, 'Game not found');
    if (game.status !== 'OPEN' || game.openSlots <= 0) throw createError(400, 'Game is full or not open');
    if (game.players.includes(playerId)) throw createError(400, 'Player is already in the game');
    
    const existing = await inviteRepo.findPending(gameId, playerId);
    if (existing) throw createError(400, 'Pending invitation already exists');

    const invite = await inviteRepo.create({ gameId, senderId, playerId });
    
    // Automatically dispatch a notification
    await notifService.createNotification(
      playerId, 'GAME_INVITATION', 'New Squad Invite',
      `You have been invited to join ${game.title}`, gameId
    );

    return invite;
  }

  async acceptInvitation(inviteId, userId) {
    const invite = await inviteRepo.findById(inviteId);
    if (!invite) throw createError(404, 'Invitation not found');
    if (invite.playerId !== userId) throw createError(403, 'Not authorized');
    if (invite.status !== 'PENDING') throw createError(400, 'Invitation is no longer pending');

    // This automatically handles slot math and Full status protections
    await gameService.joinGame(invite.gameId, userId);
    await inviteRepo.updateStatus(inviteId, 'ACCEPTED');

    const game = await gameRepo.findById(invite.gameId);

    // Notify Host
    await notifService.createNotification(
      game.hostId, 'PLAYER_JOINED', 'Squad Slot Filled',
      `A player accepted your invite for ${game.title}`, game.id
    );

    return invite;
  }

  async rejectInvitation(inviteId, userId) {
    const invite = await inviteRepo.findById(inviteId);
    if (!invite) throw createError(404, 'Invitation not found');
    if (invite.playerId !== userId) throw createError(403, 'Not authorized');
    
    return await inviteRepo.updateStatus(inviteId, 'REJECTED');
  }
}

module.exports = new InviteService();