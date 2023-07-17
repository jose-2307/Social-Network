const boom = require("@hapi/boom");
const Post = require("../models/post.model");
const Follow = require("../models/follow.model");

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
        console.log(relations);
        //Obtener los posts de los usuarios/comunidades vinculados
        // const follows = [];
        const posts = [];
        for (let x of relations) {
            for (let y of Object.keys(x)) {
                if (x[y] != userId) { //Para evitar buscar al usuario "tratante"
                    // follows.push(x[y]);
                    const p = await Post.find({ userId: x[y], isCommunity });
                    posts.push(p);
                }
            }
        }
        //Obtener los posts del usuario
        const myPosts = await Post.find({ userId});
        posts.push(myPosts);
        //Ordenar por fecha de creación
        console.log(posts);

        //Agregar número de likes y comentarios por posts
        // return posts;
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
