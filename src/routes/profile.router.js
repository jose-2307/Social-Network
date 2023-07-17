const express = require("express");
const passport = require("passport");
const UserService = require("../services/user.service");
const PostService = require("../services/post.service");
const validatorHandler = require("../middlewares/validator.handler");
const { updateUserSchema } = require("../schemas/user.schema");
const { createDeleteFollowSchema } = require("../schemas/follow.schema");
const FollowService = require("../services/follow.service");

const router = express.Router();
const userService = new UserService();
const postService = new PostService();
const followService = new FollowService();

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
      const resp = await userService.update(user.sub,body);
      delete resp.dataValues.recoveryToken;
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

router.get("/posts", 
  passport.authenticate("jwt", {session: false}),
  validatorHandler(updateUserSchema, "query"),
  async (req, res, next) => {
    try {
        const user = req.user;
        const { isCommunity } = req.query;
        const resp = await postService.find(user.sub, isCommunity);
        res.json(resp);
    } catch (error) {
        next(error);
    }
  }
);



module.exports = router;