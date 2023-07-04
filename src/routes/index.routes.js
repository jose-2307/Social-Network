const express = require("express");

//routers específicos
const userRouter = require("./user.router");

const routerApi = (app) => {
  const router = express.Router();
  app.use("/api/v1",router);
  router.use("/users",userRouter);
}

module.exports = routerApi;