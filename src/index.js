const express = require("express");
const cors = require("cors");
const routerApi = require("./routes/index.routes");
require("./database");
const morgan = require("morgan");
const { boomErrorHandler, errorHandler, logErrors } = require("./middlewares/error.handler");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); //obtenemos los datos en formato json

const whitelist = ["http://localhost:5173"];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("No permitido"));
    }
  }
}
app.use(cors(options)); //controlamos el acceso


routerApi(app);

//middlewares
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.use(morgan("dev")); //Permite tener información sobre la petición realizada

app.listen(port,() => {
  console.log(`Escuchando en el puerto ${port}`);
})
