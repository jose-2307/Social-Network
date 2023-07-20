const express = require("express");
const passport = require("passport");
const UserService = require("../services/user.service");
const PostService = require("../services/post.service");
const LikeService = require("../services/like.service");
const CommentService = require("../services/comment.service");
const validatorHandler = require("../middlewares/validator.handler");
const { updateUserSchema } = require("../schemas/user.schema");
const { createDeleteFollowSchema } = require("../schemas/follow.schema");
const { createPostSchema, getPostSchema,getQueryPostSchema, getLikeSchema, createCommentSchema, getCommentSchema } = require("../schemas/post.schema");
const FollowService = require("../services/follow.service");

const router = express.Router();
const userService = new UserService();
const postService = new PostService();
const followService = new FollowService();
const likeService = new LikeService();
const commentService = new CommentService();

router.get("/user",
  async (req, res, next) => {
    try {
      const users = await userService.find();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/personal-information",
    passport.authenticate("jwt", {session: false}),
    async (req, res, next) => {
        try {
            const user = req.user;
            const resp = await userService.findOne(user.sub);
            delete resp._doc.recoveryToken;
            res.json(resp);
        } catch (error) {
            next(error);
        }
    }
);

router.patch("/personal-information",
  passport.authenticate("jwt", {session: false}),
  validatorHandler(updateUserSchema, "body"),
  async (req, res, next) => {
    try {
      const user = req.user;
      const body = req.body;
      const resp = await userService.changePass(user.sub,body);
      res.json(resp);
    } catch (error) {
      next(error);
    }
  }
);


router.get("/follow",
  passport.authenticate("jwt", {session: false}),
  async (req, res, next) => {
    try {
        const user = req.user;
        const resp = await followService.getFriends(user.sub);
        res.json(resp);
    } catch (error) {
        next(error);
    }
  }
);

router.post("/follow",
  passport.authenticate("jwt", {session: false}),
  validatorHandler(createDeleteFollowSchema, "body"),
  async (req, res, next) => {
    try {
        const user = req.user;
        const { id } = req.body;
        const resp = await followService.create({ user1Id: user.sub, user2Id: id });
        res.status(201).json(resp);
    } catch (error) {
        next(error);
    }
  }
);

router.delete("/follow/:id",
  passport.authenticate("jwt", {session: false}),
  validatorHandler(createDeleteFollowSchema, "params"),
  async (req, res, next) => {
    try {
        const user = req.user;
        const { id } = req.params;
        const resp = await followService.delete(user.sub, id);
        res.json(resp);
    } catch (error) {
        next(error);
    }
  }
);

router.post("/post",
  passport.authenticate("jwt", {session: false}),
  validatorHandler(createPostSchema, "body"),
  async (req, res, next) => {
    try {
        const user = req.user;
        const body = req.body;
        const resp = await postService.create({...body, userId: user.sub, isCommunity: user.role});
        res.status(201).json(resp);
    } catch (error) {
        next(error);
    }
  }
);


router.get("/post", 
  passport.authenticate("jwt", {session: false}),
  validatorHandler(getQueryPostSchema, "query"),
  async (req, res, next) => {
    try {
        const user = req.user;
        const { isCommunity } = req.query;
        const resp = isCommunity ? await postService.find(user.sub, isCommunity) : await postService.find(user.sub);
        res.json(resp);
    } catch (error) {
        next(error);
    }
  }
);

router.get("/post/:id", 
  passport.authenticate("jwt", {session: false}),
  validatorHandler(getPostSchema, "params"),
  async (req, res, next) => {
    try {
        const { id } = req.params;
        const resp = await postService.findOne(id);
        res.json(resp);
    } catch (error) {
        next(error);
    }
  }
);

router.get("/recommendations",
  
  passport.authenticate("jwt", {session: false}),
  async (req, res, next) => {
  try {
    const user = req.user;
    // const recommendations = await followService.getFriendRecommendations(userId);
    const recommendations = await followService.getFriendRecommendationsV4(user.sub);
    
    res.json(recommendations);
  } catch (error) {
    next(error);
  }
});

router.post("/post/:id/like",
  passport.authenticate("jwt", {session: false}),
  validatorHandler(getPostSchema, "params"),
  async (req, res, next) => {
    try {
        const user = req.user;
        const {id} = req.params;
        const resp = await likeService.create({userId: user.sub, postId: id});
        res.status(201).json(resp);
    } catch (error) {
        next(error);
    }
  }
);

router.delete("/post/:id/like",
  passport.authenticate("jwt", {session: false}),
  validatorHandler(getPostSchema, "params"),
  async (req, res, next) => {
    try {
        const user = req.user;
        const {id} = req.params;
        const resp = await likeService.delete(user.sub, id);
        res.json(resp);
    } catch (error) {
        next(error);
    }
  }
);

router.post("/post/:id/comment",
  passport.authenticate("jwt", {session: false}),
  validatorHandler(getPostSchema, "params"),
  validatorHandler(createCommentSchema, "body"),
  async (req, res, next) => {
    try {
        const user = req.user;
        const body = req.body;
        const { id } = req.params;
        const resp = await commentService.create({...body, userId: user.sub, postId: id});
        res.status(201).json(resp);
    } catch (error) {
        next(error);
    }
  }
);

router.get("/post/:id/comment",
  passport.authenticate("jwt", {session: false}),
  validatorHandler(getPostSchema, "params"),
  async (req, res, next) => {
    try {
        const { id } = req.params;
        const resp = await commentService.findByPost(id);
        res.json(resp);
    } catch (error) {
        next(error);
    }
  }
);

router.delete("/post/:id/comment/:commentId",
  passport.authenticate("jwt", {session: false}),
  validatorHandler(getCommentSchema, "params"),
  async (req, res, next) => {
    try {
        const user = req.user;
        const { commentId } = req.params;
        const resp = await commentService.delete(commentId, user.sub);
        res.status(201).json(resp);
    } catch (error) {
        next(error);
    }
  }
);

router.get("/tags",
  passport.authenticate("jwt", {session: false}),
  async (req, res, next) => {
    try {
        const user = req.user;
        const resp = await commentService.findTags(user.sub);
        res.json(resp);
    } catch (error) {
        next(error);
    }
  }
);

router.patch("/tags",
  passport.authenticate("jwt", {session: false}),
  async (req, res, next) => {
    try {
        const body = req.body;
        const resp = await commentService.updateTag(body);
        res.json(resp);
    } catch (error) {
        next(error);
    }
  }
);


module.exports = router;