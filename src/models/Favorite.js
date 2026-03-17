// models/Favorite.js
const { Schema, model } = require("mongoose");

const favoriteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    storyId: {
      type: Schema.Types.ObjectId,
      ref: "Story",
      required: true,
    },
  },
  { timestamps: true }
);

favoriteSchema.index({ userId: 1, storyId: 1 }, { unique: true });

module.exports = model("Favorite", favoriteSchema);