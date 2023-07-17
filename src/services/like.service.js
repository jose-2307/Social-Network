const boom = require("@hapi/boom");
const Like = require("../models/like.model");

class followService {
    async create(data) {
        const { userId, postId } = data;
        const resp = await Like.findOne({ userId, postId });
        if (resp) {
            throw boom.conflict("Existing Like");
        }
        const like = Like(data);
        const newLike = await like.save();
        return newLike;
    }

    async delete(userId, postId) {
        const resp = await Like.findOne({ userId, postId });
        if (!resp) {
            throw boom.notFound("Like not found.");
        }
        await Like.findOneAndRemove({ userId, postId });
        return { user1Id, user2Id };
    }
}

module.exports = followService;
