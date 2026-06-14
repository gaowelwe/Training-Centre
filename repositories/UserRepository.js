const User = require("../models/User");

class UserRepository {
    async create(userData) {
        return await User.create(userData);
    }

    async getAll() {
        return await User.findAll();
    }

    async findByEmail(email) {
        return await User.findOne({ where: { email } });
    }
}

module.exports = new UserRepository();