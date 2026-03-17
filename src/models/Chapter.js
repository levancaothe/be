const { Schema, model } = require("mongoose");

const chapterSchema = new Schema(
  {
    story: { type: Schema.Types.ObjectId, ref: "Story", required: true },
    title: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
    content: { type: String, required: true, default: "" },
  },
  { timestamps: true }
);

chapterSchema.index({ story: 1, order: 1 });

module.exports = model("Chapter", chapterSchema);
