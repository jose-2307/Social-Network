const express = require("express");
const passport = require("passport");
const UserService = require("../services/user.service");
const validatorHandler = require("../middlewares/validator.handler");
const { updateUserSchema } = require("../schemas/user.schema");

const router = express.Router();
const userService = new UserService();

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

module.exports = router;