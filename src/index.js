const express = require("express");
const cors = require("cors");
const routerApi = require("./routes/index.routes");
// require("./database");

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


app.listen(port,() => {
  console.log(`Escuchando en el puerto ${port}`);
})
