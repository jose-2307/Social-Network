const express = require("express");
const redis = require("redis");
const { promisify } = require("util");
const UserService = require("../services/user.service");
const validatorHandler = require("../middlewares/validator.handler");
const { createUserSchema, getUserSchema } = require("../schemas/user.schema");

const router = express.Router();
const service = new UserService();

const client = redis.createClient({
  host: "127.0.0.1",
  port: 6379,
});

const GET_REDIS = promisify(client.get).bind(client); //Envuelve el callback en una promesa para facilitar la mantención de las rutas
const SET_REDIS = promisify(client.set).bind(client);

router.get("/", async (req, res, next) => {
  try {
    //Respuesta desde el cache
    const reply = await GET_REDIS("users");
    if (reply) {
      return res.json(JSON.parse(reply)); //Se verifica en memoria la data
    } else {
      const users = await service.find();
      await SET_REDIS("users", JSON.stringify(users));
      res.json(users);
    }
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  validatorHandler(getUserSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const reply = await GET_REDIS(req.originalUrl); //Almacena la url en vez del id como tal
      if (reply) {
        res.json(JSON.parse(reply));
      } else {
        const user = await service.findOne(id);
        await SET_REDIS(req.originalUrl, JSON.stringify(user));
        res.json(user);
      }
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  validatorHandler(createUserSchema, "body"),
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
