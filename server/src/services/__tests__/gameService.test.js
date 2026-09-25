const gameService = require('../gameService');
const gameRepo = require('../../repositories/memory/gameRepository');

// Mock the repository
jest.mock('../../repositories/memory/gameRepository');
jest.mock('../../repositories/memory/userRepository', () => ({
  findById: jest.fn().mockResolvedValue({ id: 'u2', name: 'Mock User' })
}));

describe('Game Service - Join Logic', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should allow a user to join an open game with slots', async () => {
    const mockGame = { id: 'g1', status: 'OPEN', openSlots: 2, players: ['u1'] };
    gameRepo.findById.mockResolvedValue(mockGame);
    gameRepo.update.mockResolvedValue({ ...mockGame, openSlots: 1, players: ['u1', 'u2'] });

    const result = await gameService.joinGame('g1', 'u2');
    
    expect(gameRepo.update).toHaveBeenCalledWith('g1', { 
      players: ['u1', 'u2'], openSlots: 1, status: 'OPEN' 
    });
    expect(result.openSlots).toBe(1);
  });

  it('should change status to FULL when the last slot is taken', async () => {
    const mockGame = { id: 'g1', status: 'OPEN', openSlots: 1, players: ['u1', 'u2'] };
    gameRepo.findById.mockResolvedValue(mockGame);
    gameRepo.update.mockResolvedValue({ ...mockGame, openSlots: 0, status: 'FULL', players: ['u1', 'u2', 'u3'] });

    await gameService.joinGame('g1', 'u3');
    
    expect(gameRepo.update).toHaveBeenCalledWith('g1', { 
      players: ['u1', 'u2', 'u3'], openSlots: 0, status: 'FULL' 
    });
  });

  it('should throw an error if the user is already in the game', async () => {
    gameRepo.findById.mockResolvedValue({ id: 'g1', status: 'OPEN', openSlots: 2, players: ['u1'] });
    
    await expect(gameService.joinGame('g1', 'u1')).rejects.toThrow('User is already in this game');
  });
});