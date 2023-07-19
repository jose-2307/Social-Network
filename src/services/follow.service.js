const boom = require("@hapi/boom");
const Follow = require("../models/follow.model");

class followService {
    async create(data) {
        const { user1Id, user2Id } = data;
        const relation = await Follow.findOne({$or: [{ user1Id, user2Id }, {user1Id: user2Id, user2Id: user1Id}]});
        if (relation) {
            throw boom.conflict("Existing relationship");
        }
        const follow = Follow(data);
        const newFollow = await follow.save();
        return newFollow;
    }

    async delete(user1Id, user2Id) {
        const relation = await Follow.findOne({$or: [{ user1Id, user2Id }, {user1Id: user2Id, user2Id: user1Id}]});
        if (!relation) {
            throw boom.notFound("relation not found");
        }
        await Follow.findOneAndRemove({$or: [{ user1Id, user2Id }, {user1Id: user2Id, user2Id: user1Id}]});
        return { user1Id, user2Id };
    }
}

module.exports = followService;
