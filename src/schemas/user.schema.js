const Joi = require("joi");

const id = Joi.number().integer();
const name = Joi.string().min(3).max(15);
const email = Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "cl"] } });
const isCommunity = Joi.boolean();

const password = Joi.string().alphanum().min(8).max(12);

const createUserSchema = Joi.object({
    name: name.required(),
    email: email.required(),
    password: password.required(),
    isCommunity,
});

const updateUserSchema = Joi.object({
    name,
    email,
    password,
});

const getUserSchema = Joi.object({
    id: id.required(),
});

module.exports = { createUserSchema, updateUserSchema, getUserSchema }