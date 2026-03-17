const Chapter = require("../models/Chapter");
const Story = require("../models/Story");

// GET /chapters?storyId=xxx — Danh sách chương của truyện (chỉ title + order, không trả content)
exports.getChaptersByStoryId = async (req, res) => {
  try {
    const { storyId } = req.query;
    if (!storyId) {
      return res.status(400).json({ status: "fail", message: "Thiếu storyId." });
    }
    const chapters = await Chapter.find({ story: storyId })
      .select("_id title order createdAt")
      .sort({ order: 1 })
      .lean();
    return res.status(200).json({
      status: "success",
      data: chapters,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message || "Lỗi lấy danh sách chương.",
    });
  }
};

// GET /chapters/:chapterId — Nội dung một chương (để đọc)
exports.getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.chapterId)
      .populate("story", "title slug")
      .lean();
    if (!chapter) {
      return res.status(404).json({
        status: "fail",
        message: "Không tìm thấy chương.",
      });
    }
    return res.status(200).json({
      status: "success",
      data: chapter,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message || "Lỗi lấy nội dung chương.",
    });
  }
};

// Tăng views cho truyện khi đọc chương (gọi từ FE nếu cần)
exports.incrementStoryViews = async (req, res) => {
  try {
    const { storyId } = req.body;
    if (!storyId) return res.status(400).json({ status: "fail", message: "Thiếu storyId." });
    await Story.findByIdAndUpdate(storyId, { $inc: { views: 1 } });
    return res.status(200).json({ status: "success" });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message });
  }
};
