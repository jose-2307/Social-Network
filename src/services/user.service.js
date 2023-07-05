const User = require("../models/user.model");

class UserService {

    async create(data) {
        const user = User(data);
        const newUser = await user.save();
        return newUser;
    }

    async find() {
        
    }

    async findOne(id) {
        
    }

}

module.exports = UserService;