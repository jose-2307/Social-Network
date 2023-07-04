const express = require("express");
const UserService = require("../services/user.service");

const router = express.Router();
const service = new UserService();

router.get("/",
  async (req, res, next) => {
    try {
    //   const users = await service.find();
    const users = {
        name: "pedro",
        age: 22
    }
      res.json(users);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;