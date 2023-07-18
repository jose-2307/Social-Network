const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    comment: {
        type: String,
        required: true,
        trim: true,
    },
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

module.exports = model("Comment", commentSchema);
