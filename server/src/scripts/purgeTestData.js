require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../data/models/User');
const Game = require('../data/models/Game');
const Invite = require('../data/models/Invite');
const Notification = require('../data/models/Notification');
const ReliabilityEvent = require('../data/models/ReliabilityEvent');
const logger = require('../utils/logger');

// Accounts created by the seed scripts. Games hosted by these are safe to remove.
const SEED_HOST_USERNAMES = ['squadup_seeder', 'tanuj_playmaker', 'biki_smash', 'aditya_core', 'souvik_cricket'];

// Usernames from indianNamesPool in client/src/pages/GameSpacePage.jsx,
// in case they were ever persisted to MongoDB.
const DUMMY_USERNAMES = [
  'rahul_dev88', 'priya_m', 'karan_singh', 'neha_b', 'amit_sharma', 'vikash_k',
  'arjun_p', 'sneha_raj', 'rohit_99', 'kabir_d', 'biki_99', 'tanuj_k', 'adityap',
];

const DRY_RUN = process.argv.includes('--dry-run');
const PURGE_ALL = process.argv.includes('--all');
const CONFIRMED = process.argv.includes('--yes');

const purgeTestData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info(`Connected to MongoDB${DRY_RUN ? ' (DRY RUN - no changes will be written)' : ''}`);

    // 1. Identify seeded games. Preferred marker is the `seeded` flag written by
    //    seedGames.js; older seeds predate that flag, so fall back to seed hosts.
    const seedHosts = await User.find({ username: { $in: SEED_HOST_USERNAMES } }).select('_id username');
    const seedHostIds = seedHosts.map((u) => u._id);

    const gamesFilter = {
      $or: [
        { seeded: true },
        ...(seedHostIds.length ? [{ hostId: { $in: seedHostIds } }] : []),
      ],
    };

    const totalGames = await Game.countDocuments({});
    const identified = await Game.countDocuments(gamesFilter);
    const useAll = PURGE_ALL || identified === totalGames;

    // 2. Dummy roster users, if they were ever persisted.
    const dummyUsers = await User.find({ username: { $in: DUMMY_USERNAMES } }).select('_id');
    const dummyUserIds = dummyUsers.map((u) => u._id);
    const dummyUserFilter = dummyUserIds.length ? { _id: { $in: dummyUserIds } } : null;

    const dummyInvites = dummyUserFilter ? await Invite.countDocuments(dummyUserFilter) : 0;
    const dummyNotifs = dummyUserFilter ? await Notification.countDocuments(dummyUserFilter) : 0;
    const dummyEvents = dummyUserFilter ? await ReliabilityEvent.countDocuments(dummyUserFilter) : 0;

    logger.warn('--- Purge plan ---');
    logger.warn(`  Games identified as mock : ${useAll ? totalGames : identified} of ${totalGames}`);
    logger.warn(`  Seed host accounts       : ${seedHosts.length} [${SEED_HOST_USERNAMES.join(', ')}]`);
    logger.warn(`  Dummy roster users       : ${dummyUsers.length}`);
    logger.warn(`  Their invites            : ${dummyInvites}`);
    logger.warn(`  Their notifications      : ${dummyNotifs}`);
    logger.warn(`  Their reliability events : ${dummyEvents}`);
    logger.warn(`  Will delete seed accounts: ${!DRY_RUN && CONFIRMED ? 'yes' : 'no'}`);
    logger.warn('----------------------');

    if (DRY_RUN) {
      logger.info('DRY RUN complete. Nothing was deleted.');
      await mongoose.connection.close();
      return process.exit(0);
    }

    // 3. Safety: a wipe that covers EVERY game is irreversible and almost always a
    //    mistake, so it requires an explicit second acknowledgement flag.
    if (useAll && totalGames > 0 && !CONFIRMED) {
      logger.warn('ABORTED: this would delete every game in the database.');
      logger.warn('Re-run with --all --yes if that is genuinely intended.');
      await mongoose.connection.close();
      return process.exit(1);
    }

    if (!useAll && identified === 0) {
      logger.warn('No mock games identified and nothing would be deleted. Aborting.');
      logger.warn('Re-run seed:games if you want the data properly tagged for purging.');
      await mongoose.connection.close();
      return process.exit(1);
    }

    const deletedGames = await Game.deleteMany(useAll ? {} : gamesFilter);
    logger.info(`Deleted ${deletedGames.deletedCount} mock games.`);

    if (dummyUserFilter) {
      const d1 = await Invite.deleteMany(dummyUserFilter);
      const d2 = await Notification.deleteMany(dummyUserFilter);
      const d3 = await ReliabilityEvent.deleteMany(dummyUserFilter);
      const d4 = await User.deleteMany(dummyUserFilter);
      logger.info(
        `Deleted dummy data: ${d1.deletedCount} invites, ${d2.deletedCount} notifications, ` +
        `${d3.deletedCount} reliability events, ${d4.deletedCount} users.`
      );
    }

    const deletedHosts = await User.deleteMany({ username: { $in: SEED_HOST_USERNAMES } });
    logger.info(`Deleted ${deletedHosts.deletedCount} seed account(s).`);

    const remaining = await Game.countDocuments({});
    logger.info(`Purge complete. ${remaining} game(s) remain.`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    logger.error(`Purge failed: ${err.message}`);
    process.exit(1);
  }
};

purgeTestData();
