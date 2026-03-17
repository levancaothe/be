const Category = require("../models/Category");

// GET /categories — Lấy tất cả category (public)
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    return res.status(200).json({
      status: "success",
      data: categories,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message || "Lỗi lấy danh sách thể loại.",
    });
  }
};
