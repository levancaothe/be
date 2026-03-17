const Category = require("../../models/Category");
const { slugify } = require("../../utils/slugify");

// GET /admin/categories
exports.list = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    return res.status(200).json({ status: "success", data: categories });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message || "Lỗi lấy danh sách thể loại." });
  }
};

// GET /admin/categories/:id
exports.getById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).lean();
    if (!category) return res.status(404).json({ status: "fail", message: "Không tìm thấy thể loại." });
    return res.status(200).json({ status: "success", data: category });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message });
  }
};

// POST /admin/categories
exports.create = async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ status: "fail", message: "Vui lòng nhập tên thể loại." });
    const finalSlug = (slug && slug.trim()) || slugify(name);
    const existing = await Category.findOne({ $or: [{ slug: finalSlug }, { name: name.trim() }] });
    if (existing) return res.status(400).json({ status: "fail", message: "Tên hoặc slug thể loại đã tồn tại." });
    const category = await Category.create({
      name: name.trim(),
      slug: finalSlug,
      description: description ? String(description).trim() : "",
    });
    return res.status(201).json({ status: "success", data: category });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message || "Lỗi tạo thể loại." });
  }
};

// PUT /admin/categories/:id
exports.update = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ status: "fail", message: "Không tìm thấy thể loại." });
    const { name, slug, description } = req.body;
    if (name !== undefined && name.trim()) {
      const finalSlug = (slug && slug.trim()) || slugify(name);
      const existing = await Category.findOne({ $or: [{ slug: finalSlug }, { name: name.trim() }], _id: { $ne: category._id } });
      if (existing) return res.status(400).json({ status: "fail", message: "Tên hoặc slug thể loại đã tồn tại." });
      category.name = name.trim();
      category.slug = finalSlug;
    } else if (slug !== undefined && slug.trim()) {
      const existing = await Category.findOne({ slug: slug.trim(), _id: { $ne: category._id } });
      if (existing) return res.status(400).json({ status: "fail", message: "Slug đã tồn tại." });
      category.slug = slug.trim();
    }
    if (description !== undefined) category.description = String(description).trim();
    await category.save();
    return res.status(200).json({ status: "success", data: category });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message || "Lỗi cập nhật thể loại." });
  }
};

// DELETE /admin/categories/:id
exports.remove = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ status: "fail", message: "Không tìm thấy thể loại." });
    return res.status(200).json({ status: "success", message: "Đã xóa thể loại." });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message });
  }
};
