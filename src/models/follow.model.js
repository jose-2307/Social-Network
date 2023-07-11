const { Schema, model } = require("mongoose");

const followSchema = new Schema(
  {
    user1Id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    user2Id: {
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

module.exports = model("Follow", followSchema);
