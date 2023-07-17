const boom = require("@hapi/boom");
const Comment = require("../models/comment.model");

class commnetService {
    async create(data) {
        const comment = Comment(data);
        const newComment = await comment.save();
        return newComment;
    }

    async delete(userId, postId) {
        const resp = await Comment.findOne({ userId, postId });
        if (!resp) {
            throw boom.notFound("Comment not found.");
        }
        await Comment.findOneAndRemove({ userId, postId });
        return { userId, postId };
    }
}

module.exports = commnetService;