const express = require("express");
const UserService = require("../services/user.service");
const validatorHandler = require("../middlewares/validator.handler");
const { createUserSchema, getUserSchema, updateUserSchema } = require("../schemas/user.schema");

const router = express.Router();
const service = new UserService();

router.get("/",
  async (req, res, next) => {
    try {
      const users = await service.find();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/:id",
  validatorHandler(getUserSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await service.findOne(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/",
  validatorHanlder(createUserSchema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newUser = await service.create(body);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;