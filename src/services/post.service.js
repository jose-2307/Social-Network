const boom = require("@hapi/boom");
const Post = require("../models/post.model");
const Follow = require("../models/follow.model");
const LikeService = require("./like.service");
const CommentService = require("./comment.service");

const likeService = new LikeService();
const commentService = new CommentService();
class postService {
    async create(data) {
        const post = Post(data);
        const newPost = await post.save();
        return newPost;
    }
 
    async find(userId, isCommunity = false) { //Posts de amigos o comunidades que el usuario tiene, junto a los del propio usuario
        //Buscar en Follows las relaciones del usuario
        //Obtener los usuarios/comunidades vinculados
        const relations = await Follow.find({ $or: [{ user1Id: userId }, {user2Id: userId}] });
        //Obtener los posts de los usuarios/comunidades vinculados
        // const follows = [];
        let posts = [];
        for (let x of relations) {
            for (let y of Object.keys(x._doc)) {
                if ((y === "user1Id" || y === "user2Id") && x[y] != userId) { //Para evitar buscar al usuario "tratante"
                    // follows.push(x[y]);
                    const p = await Post.find({ userId: x[y], isCommunity });
                    posts.push(p);
                }
            }
        }
        // Obtener los posts del usuario si isCommunity = false
        if (!isCommunity) {
            const myPosts = await Post.find({ userId });
            posts.push(myPosts);
        }
        //Ordenar por fecha de creación
        posts = posts.flat();
        posts.sort((a,b) => b.createdAt - a.createdAt);    
        //Agregar número de likes y comentarios por posts
        const resp = [];
        for (let post of posts) {
            const likes = await likeService.findByPost(post._doc._id);
            post._doc["likes"] = likes.length;
            const comments = await commentService.findByPost(post._doc._id);
            post._doc["comments"] = comments.length;
            resp.push(post);
        }
        return resp;
    }


    async findOne(id) {
        const post = await Post.findOne({ _id: id });
        if (!post) {
        throw boom.notFound("post not found");
        }
        return post;
    }
}

module.exports = postService;
