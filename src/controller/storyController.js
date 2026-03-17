const Story = require("../models/Story");

// GET /stories — Danh sách truyện (có thể lọc theo category, phân trang)
exports.getStories = async (req, res) => {
  try {
    const { category, page = 1, limit = 12, status } = req.query;
    const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.min(50, Math.max(1, parseInt(limit, 10)));
    const perPage = Math.min(50, Math.max(1, parseInt(limit, 10)));

    const filter = {};
    if (category) filter.categories = category;
    if (status) filter.status = status;

    const [stories, total] = await Promise.all([
      Story.find(filter)
        .populate("categories", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .lean(),
      Story.countDocuments(filter),
    ]);

    return res.status(200).json({
      status: "success",
      data: {
        list: stories,
        total,
        page: Math.max(1, parseInt(page, 10)),
        limit: perPage,
        totalPages: Math.ceil(total / perPage) || 1,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message || "Lỗi lấy danh sách truyện.",
    });
  }
};

// GET /stories/:slug — Chi tiết một truyện (public)
exports.getStoryBySlug = async (req, res) => {
  try {
    const story = await Story.findOne({ slug: req.params.slug })
      .populate("categories", "name slug")
      .lean();
    if (!story) {
      return res.status(404).json({
        status: "fail",
        message: "Không tìm thấy truyện.",
      });
    }
    return res.status(200).json({
      status: "success",
      data: story,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message || "Lỗi lấy chi tiết truyện.",
    });
  }
};
