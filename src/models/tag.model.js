const { Schema, model } = require("mongoose");

const tagSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    commentId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Comment",
    },
    visualized: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Tag", tagSchema);
