const boom = require("@hapi/boom");
const Comment = require("../models/comment.model");
const Tag = require("../models/tag.model");
const Post = require("../models/post.model");
// const PostService = require("./post.service");
const UserService = require("./user.service");

// const postService = new PostService();
const userService = new UserService();

class CommentService {
    async create(data) {
        const post = await Post.findOne({_id: data.postId});
        if (!post) {
            throw boom.notFound("Post not found.");
        }
        const comment = Comment(data);
        const newComment = await comment.save();
        const user = await userService.findOne(newComment.userId);
        newComment._doc["name"] = user._doc.name;
        //Etiquetado
        const splitedValues = data.comment.split(" ");
        const tags = splitedValues.filter(x => x[0] == "@");
        let tagged = false;
        for (let tag of tags) {
            const user = await userService.findByName(tag.slice(1).replace("-", " "))
            if (user && user._doc._id.toString() !== post._doc.userId.toString()) { //Debe ser el primer usuario encontrado
                const tag = Tag({ commentId: newComment._doc._id, userId: user._doc._id });
                await tag.save();
                tagged = true;
                break;
            }
        }
        return { newComment, tagged };
    }

    async findByPost(postId) {
        const comments = await Comment.find({ postId });
        for (let comment of comments) {
            const user = await userService.findOne(comment.userId);
            comment._doc["name"] = user.name;
        }
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

    async findTags(userId) {
        const tags = await Tag.find({userId});
        for (let tag of tags) {
            const comment = await Comment.findOne({_id: tag.commentId});
            if (!comment) {
                throw boom.notFound("Comment not found.");
            }
            const user = await userService.findOne(comment.userId);
            tag._doc["name"] = user.name;
            tag._doc["comment"] = comment;
        }
        return tags;
    }

    async updateTag(data) {
        await Tag.findOneAndUpdate({_id: data.id}, {visualized: true});
        return {message: "Tag changed"}
    }
}

module.exports = CommentService;