const Joi = require("joi");

const id = Joi.string().alphanum();

const createDeleteFollowSchema = Joi.object({
    id: id.required(),
});

module.exports = { createDeleteFollowSchema }