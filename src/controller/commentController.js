const Comment = require("../models/Comment");
const Story = require("../models/Story");

// GET /comments?storyId=xxx — Danh sách comment của truyện (public, có populate user)
exports.getCommentsByStoryId = async (req, res) => {
  try {
    const { storyId } = req.query;
    if (!storyId) {
      return res.status(400).json({ status: "fail", message: "Thiếu storyId." });
    }
    const comments = await Comment.find({ storyId })
      .populate("userId", "fullName avatar")
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json({
      status: "success",
      data: comments,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message || "Lỗi lấy bình luận.",
    });
  }
};

// POST /comments — Thêm comment (đã auth, body: storyId, content)
exports.createComment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { storyId, content } = req.body;
    if (!storyId || !content || !content.trim()) {
      return res.status(400).json({
        status: "fail",
        message: "Vui lòng nhập nội dung bình luận.",
      });
    }
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ status: "fail", message: "Không tìm thấy truyện." });
    }
    const comment = await Comment.create({
      storyId,
      userId,
      content: content.trim(),
    });
    const populated = await Comment.findById(comment._id)
      .populate("userId", "fullName avatar")
      .lean();
    return res.status(201).json({
      status: "success",
      data: populated,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message || "Lỗi gửi bình luận.",
    });
  }
};

// DELETE /comments/:commentId — Xóa comment (đã auth, chỉ xóa comment của mình)
exports.deleteComment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ status: "fail", message: "Không tìm thấy bình luận." });
    }
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ status: "fail", message: "Bạn không thể xóa bình luận này." });
    }
    await Comment.findByIdAndDelete(commentId);
    return res.status(200).json({
      status: "success",
      message: "Đã xóa bình luận.",
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message || "Lỗi xóa bình luận.",
    });
  }
};
