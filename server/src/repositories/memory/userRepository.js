const User = require('../../data/models/User');

class UserRepository {
  async findById(id) {
    // This tells Mongoose to search the real database using the ID
    return await User.findById(id);
  }
  
  async findAll() {
    return await User.find({});
  }
}

module.exports = new UserRepository();