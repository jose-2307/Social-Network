const Joi = require("joi");

const id = Joi.string().alphanum();
const image = Joi.string().uri();
const title = Joi.string().max(12);
const description = Joi.string().max(40);
const isCommunity = Joi.boolean();
const userId = Joi.string().alphanum();

const createPostSchema = Joi.object({
    image,
    title: title.required(),
    description: description.required(),
    isCommunity,
    userId: userId.required()
});

const getPostSchema = Joi.object({
    id: id.required(),
});

const getQueryPostSchema = Joi.object({
    id,
});

module.exports = { createPostSchema, getPostSchema, getQueryPostSchema }