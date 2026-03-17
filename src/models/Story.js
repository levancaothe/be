// models/Story.js
const { Schema, model } = require("mongoose");

const storySchema = new Schema(
  {
    title: { type: String, required: true },

    slug: { type: String, required: true, unique: true },

    description: { type: String },

    coverImage: { type: String },

    author: { type: String },

    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    views: { type: Number, default: 0 },

    likes: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["ongoing", "completed"],
      default: "ongoing",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = model("Story", storySchema);