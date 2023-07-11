const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    image: {
        type: String,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    isCommunity: {
        type: Boolean,
        default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",      
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Post", postSchema);
