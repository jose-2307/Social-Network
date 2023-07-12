const bcrypt = require("bcrypt");
const boom = require("@hapi/boom");
const User = require("../models/user.model");
const Auth = require("../models/auth.model");


class UserService {

    async create(data) {
        const hash = await bcrypt.hash(data.password, 10);
        delete data.password;
        const user = User(data);
        const newUser = await user.save();
        await Auth({ userId: newUser._id, password: hash }).save();
        return newUser;
    }

    async find() {
        const users = await User.find({});
        return users;
    }

    async findOne(id) {
        const user = await User.findOne({ _id: id });
        if (!user) {
            throw boom.notFound("user not found");
        }
        return user;
    }

    async findByEmail(email) {
        const user = await User.findOne({ email });
        if (!user) {
          throw boom.notFound("user not found");
        }
    
        const auth = await Auth.findOne({userId: user.id});
        return {...user, password: auth.password};
    }

}

module.exports = UserService;