const express = require("express");
const redis = require("redis");
const UserService = require("../services/user.service");
const validatorHandler = require("../middlewares/validator.handler");
const { createUserSchema, getUserSchema, updateUserSchema } = require("../schemas/user.schema");

const router = express.Router();
const service = new UserService();

// Crear una conexión con Redis
const redisClient = redis.createClient();

router.get("/", async (req, res, next) => {
  try {
    
    redisClient.get("users", async (err, cachedUsers) => {
      if (err) throw err;

      if (cachedUsers) {
       
        console.log("Obteniendo usuarios desde la caché de Redis");
        res.json(JSON.parse(cachedUsers));
      } else {
       
        console.log("Obteniendo usuarios desde la base de datos");
        const users = await service.find();
        redisClient.setex("users", 3600, JSON.stringify(users));

        res.json(users);
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id",
  validatorHandler(getUserSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      redisClient.get(`user:${id}`, async (err, cachedUser) => {
        if (err) throw err;
        if (cachedUser) {
         
          console.log(`Obteniendo usuario ${id} desde la caché de Redis`);
          res.json(JSON.parse(cachedUser));
        } else {

          console.log(`Obteniendo usuario ${id} desde la base de datos`);
          const user = await service.findOne(id);
          redisClient.setex(`user:${id}`, 3600, JSON.stringify(user));

          res.json(user);
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/",
  validatorHandler(createUserSchema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newUser = await service.create(body);
      redisClient.del("users");
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
