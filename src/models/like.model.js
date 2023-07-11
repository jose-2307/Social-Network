const { Schema, model } = require("mongoose");

const likeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    postId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Post",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Like", likeSchema);
