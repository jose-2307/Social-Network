const { connect } = require("mongoose");
const { config } = require("./config/config");

//Se ejecutará la función anónima cuando sea importado el archivo

const user = encodeURIComponent(config.DBuser);
const password = encodeURIComponent(config.DBpassword); //Se aplica debido a que se está utilizando un caracter especial

const DB_URI = `mongodb+srv://${user}:${password}@cluster0.sfrqsye.mongodb.net/social-network-db?retryWrites=true&w=majority`;

(async () => {
    try {
        const db = await connect(DB_URI);
        console.log(`DB conected to ${db.connection.name}`);
    } catch (error) {
        console.error(error);
    }
})();
