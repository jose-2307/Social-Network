const boom = require("@hapi/boom");

/**
 * Objetivo: Visualizar los errores por consola
 */
const logErrors = (err, req, res, next) => {
  console.error(err);
  next(err);
}

/**
 * Objetivo: Enviar el error en un formato legible al cliente
 */
const errorHandler = (err, req, res, next) => {
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
}

/**
 * Objetivo: Identificar un error del tipo "boom" y mostrar su información correspondiente (statuscode)
 */

const boomErrorHandler = (err, req, res, next) => {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  }
  next(err); //En caso de no ser del tipo "boom" lo envía a errorHandler
}



module.exports = { logErrors, errorHandler, boomErrorHandler }
