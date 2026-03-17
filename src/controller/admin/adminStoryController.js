const Story = require("../../models/Story");
const { slugify } = require("../../utils/slugify");

// GET /admin/stories — list với phân trang
exports.list = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, status, search } = req.query;
    const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.min(50, Math.max(1, parseInt(limit, 10)));
    const perPage = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const filter = {};
    if (category) filter.categories = category;
    if (status) filter.status = status;
    if (search && search.trim()) {
      filter.$or = [
        { title: new RegExp(search.trim(), "i") },
        { author: new RegExp(search.trim(), "i") },
      ];
    }
    const [list, total] = await Promise.all([
      Story.find(filter).populate("categories", "name slug").sort({ createdAt: -1 }).skip(skip).limit(perPage).lean(),
      Story.countDocuments(filter),
    ]);
    return res.status(200).json({
      status: "success",
      data: { list, total, page: Math.max(1, parseInt(page, 10)), limit: perPage, totalPages: Math.ceil(total / perPage) || 1 },
    });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message || "Lỗi lấy danh sách truyện." });
  }
};

// GET /admin/stories/:id
exports.getById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate("categories", "name slug").lean();
    if (!story) return res.status(404).json({ status: "fail", message: "Không tìm thấy truyện." });
    return res.status(200).json({ status: "success", data: story });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message });
  }
};

// POST /admin/stories
exports.create = async (req, res) => {
  try {
    const { title, slug, description, coverImage, author, categories, status, createdBy } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ status: "fail", message: "Vui lòng nhập tiêu đề truyện." });
    const finalSlug = (slug && slug.trim()) || slugify(title);
    const existing = await Story.findOne({ slug: finalSlug });
    if (existing) return res.status(400).json({ status: "fail", message: "Slug truyện đã tồn tại." });
    const story = await Story.create({
      title: title.trim(),
      slug: finalSlug,
      description: description ? String(description).trim() : "",
      coverImage: coverImage ? String(coverImage).trim() : "",
      author: author ? String(author).trim() : "",
      categories: Array.isArray(categories) ? categories : [],
      status: status === "completed" ? "completed" : "ongoing",
      createdBy: createdBy || req.user.userId,
    });
    const populated = await Story.findById(story._id).populate("categories", "name slug").lean();
    return res.status(201).json({ status: "success", data: populated });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message || "Lỗi tạo truyện." });
  }
};

// PUT /admin/stories/:id
exports.update = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ status: "fail", message: "Không tìm thấy truyện." });
    const { title, slug, description, coverImage, author, categories, status } = req.body;
    if (title !== undefined && title.trim()) {
      story.title = title.trim();
      const finalSlug = (slug && slug.trim()) || slugify(title);
      const existing = await Story.findOne({ slug: finalSlug, _id: { $ne: story._id } });
      if (existing) return res.status(400).json({ status: "fail", message: "Slug truyện đã tồn tại." });
      story.slug = finalSlug;
    } else if (slug !== undefined && slug.trim()) {
      const existing = await Story.findOne({ slug: slug.trim(), _id: { $ne: story._id } });
      if (existing) return res.status(400).json({ status: "fail", message: "Slug đã tồn tại." });
      story.slug = slug.trim();
    }
    if (description !== undefined) story.description = String(description).trim();
    if (coverImage !== undefined) story.coverImage = String(coverImage).trim();
    if (author !== undefined) story.author = String(author).trim();
    if (Array.isArray(categories)) story.categories = categories;
    if (status !== undefined && (status === "ongoing" || status === "completed")) story.status = status;
    await story.save();
    const populated = await Story.findById(story._id).populate("categories", "name slug").lean();
    return res.status(200).json({ status: "success", data: populated });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message || "Lỗi cập nhật truyện." });
  }
};

// DELETE /admin/stories/:id
exports.remove = async (req, res) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);
    if (!story) return res.status(404).json({ status: "fail", message: "Không tìm thấy truyện." });
    const Chapter = require("../../models/Chapter");
    await Chapter.deleteMany({ story: story._id });
    return res.status(200).json({ status: "success", message: "Đã xóa truyện và các chương." });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message });
  }
};
