const express = require("express");

//routers específicos
const userRouter = require("./user.router");
const authRouter = require("./auth.router");
const profileRouter = require("./profile.router");

const routerApi = (app) => {
  const router = express.Router();
  app.use("/api/v1",router);
  router.use("/users",userRouter);
  router.use("/auth", authRouter);
  router.use("/profile", profileRouter);
}

module.exports = routerApi;