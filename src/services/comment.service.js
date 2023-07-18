const boom = require("@hapi/boom");
const Comment = require("../models/comment.model");

class commentService {
    async create(data) {
        const comment = Comment(data);
        const newComment = await comment.save();
        return newComment;
    }

    async findByPost(postId) {
        const comments = await Comment.find({ postId });
        return comments;
    }

    async delete(id, userId) {
        const resp = await Comment.findOne({ _id: id, userId });
        if (!resp) {
            throw boom.notFound("Comment not found.");
        }
        await Comment.findOneAndRemove({ _id: id });
        return { id };
    }
}

module.exports = commentService;