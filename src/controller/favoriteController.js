const Favorite = require("../models/Favorite");
const Story = require("../models/Story");

// GET /favorites — Danh sách truyện yêu thích của user (đã auth)
exports.getMyWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const favorites = await Favorite.find({ userId })
      .populate({
        path: "storyId",
        select: "title slug coverImage author views likes status",
        populate: { path: "categories", select: "name slug" },
      })
      .sort({ createdAt: -1 })
      .lean();
    const stories = favorites.map((f) => f.storyId).filter(Boolean);
    return res.status(200).json({
      status: "success",
      data: stories,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message || "Lỗi lấy danh sách yêu thích.",
    });
  }
};

// POST /favorites — Thêm truyện vào wishlist (body: storyId)
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { storyId } = req.body;
    if (!storyId) {
      return res.status(400).json({ status: "fail", message: "Thiếu storyId." });
    }
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ status: "fail", message: "Không tìm thấy truyện." });
    }
    const existing = await Favorite.findOne({ userId, storyId });
    if (existing) {
      return res.status(200).json({
        status: "success",
        data: existing,
        message: "Đã có trong tủ yêu thích.",
      });
    }
    const fav = await Favorite.create({ userId, storyId });
    return res.status(201).json({
      status: "success",
      data: fav,
      message: "Đã thêm vào tủ yêu thích.",
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(200).json({ status: "success", message: "Đã có trong tủ yêu thích." });
    }
    return res.status(500).json({
      status: "fail",
      message: err.message || "Lỗi thêm yêu thích.",
    });
  }
};

// DELETE /favorites/:storyId — Xóa khỏi wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { storyId } = req.params;
    const deleted = await Favorite.findOneAndDelete({ userId, storyId });
    return res.status(200).json({
      status: "success",
      message: deleted ? "Đã bỏ khỏi tủ yêu thích." : "Không tìm thấy trong tủ yêu thích.",
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message || "Lỗi bỏ yêu thích.",
    });
  }
};

// GET /favorites/check/:storyId — Kiểm tra đã yêu thích chưa (đã auth)
exports.checkWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { storyId } = req.params;
    const fav = await Favorite.findOne({ userId, storyId }).lean();
    return res.status(200).json({
      status: "success",
      data: { inWishlist: !!fav },
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message || "Lỗi kiểm tra.",
    });
  }
};
