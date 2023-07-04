const { connect } = require("mongoose");

//Se ejecutará la función anónima cunado sea importado el archivo
(async () => {
    try {
        const db = await connect("");
        console.log(`DB conected to ${db.connection.name}`);
    } catch (error) {
        console.error(error);
    }
})();
