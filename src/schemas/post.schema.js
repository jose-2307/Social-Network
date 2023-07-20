const Joi = require("joi");

const id = Joi.string().alphanum();
const image = Joi.string().uri();
const title = Joi.string().max(12);
const description = Joi.string().max(120);
const isCommunity = Joi.boolean();
const commentId = Joi.string().alphanum();
const likeId = Joi.string().alphanum();
const comment = Joi.string().max(150);

const createPostSchema = Joi.object({
  image,
  title: title.required(),
  description: description.required(),
  isCommunity,
});

const getPostSchema = Joi.object({
  id: id.required(),
});

const getLikeSchema = Joi.object({
  likeId: likeId.required(),
});

const getQueryPostSchema = Joi.object({
  isCommunity,
});

const createCommentSchema = Joi.object({
  comment: comment.required(),
});

const getCommentSchema = Joi.object({
  commentId: commentId.required(),
  id,
});

module.exports = {
  createPostSchema,
  getPostSchema,
  getQueryPostSchema,
  getLikeSchema,
  createCommentSchema,
  getCommentSchema,
};
