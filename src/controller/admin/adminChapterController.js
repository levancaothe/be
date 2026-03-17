const Chapter = require("../../models/Chapter");
const Story = require("../../models/Story");

// GET /admin/chapters?storyId=xxx
exports.list = async (req, res) => {
  try {
    const { storyId } = req.query;
    if (!storyId) return res.status(400).json({ status: "fail", message: "Thiếu storyId." });
    const chapters = await Chapter.find({ story: storyId }).sort({ order: 1 }).lean();
    return res.status(200).json({ status: "success", data: chapters });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message || "Lỗi lấy danh sách chương." });
  }
};

// GET /admin/chapters/:id
exports.getById = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id).populate("story", "title slug").lean();
    if (!chapter) return res.status(404).json({ status: "fail", message: "Không tìm thấy chương." });
    return res.status(200).json({ status: "success", data: chapter });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message });
  }
};

// POST /admin/chapters
exports.create = async (req, res) => {
  try {
    const { storyId, title, order, content } = req.body;
    if (!storyId || !title || !title.trim()) {
      return res.status(400).json({ status: "fail", message: "Vui lòng nhập storyId và tiêu đề chương." });
    }
    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ status: "fail", message: "Không tìm thấy truyện." });
    const maxOrder = await Chapter.findOne({ story: storyId }).sort({ order: -1 }).select("order").lean();
    const finalOrder = order != null && !isNaN(Number(order)) ? Number(order) : (maxOrder?.order ?? 0) + 1;
    const chapter = await Chapter.create({
      story: storyId,
      title: title.trim(),
      order: finalOrder,
      content: content ? String(content).trim() : "",
    });
    const populated = await Chapter.findById(chapter._id).populate("story", "title slug").lean();
    return res.status(201).json({ status: "success", data: populated });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message || "Lỗi tạo chương." });
  }
};

// PUT /admin/chapters/:id
exports.update = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) return res.status(404).json({ status: "fail", message: "Không tìm thấy chương." });
    const { title, order, content } = req.body;
    if (title !== undefined && title.trim()) chapter.title = title.trim();
    if (order !== undefined && !isNaN(Number(order))) chapter.order = Number(order);
    if (content !== undefined) chapter.content = String(content).trim();
    await chapter.save();
    const populated = await Chapter.findById(chapter._id).populate("story", "title slug").lean();
    return res.status(200).json({ status: "success", data: populated });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message || "Lỗi cập nhật chương." });
  }
};

// DELETE /admin/chapters/:id
exports.remove = async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndDelete(req.params.id);
    if (!chapter) return res.status(404).json({ status: "fail", message: "Không tìm thấy chương." });
    return res.status(200).json({ status: "success", message: "Đã xóa chương." });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message });
  }
};
