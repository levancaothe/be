// models/Category.js
const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    name: { type: String, required: true },

    slug: { type: String, required: true, unique: true },

    description: { type: String },
  },
  { timestamps: true }
);

module.exports = model("Category", categorySchema);