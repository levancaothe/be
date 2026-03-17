const User = require("../models/user");
const bcrypt = require("bcrypt");

// GET /user/profile - Lấy thông tin user (đã auth)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "Không tìm thấy người dùng.",
      });
    }
    return res.status(200).json({
      status: "success",
      data: user.toJSON(),
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message || "Lỗi lấy thông tin.",
    });
  }
};

// PUT /user/profile - Cập nhật profile (fullName, phone, avatar)
exports.editProfile = async (req, res) => {
  try {
    const { fullName, phone, avatar } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "Không tìm thấy người dùng.",
      });
    }
    if (fullName !== undefined) user.fullName = fullName.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (avatar !== undefined) user.avatar = avatar;
    await user.save();
    return res.status(200).json({
      status: "success",
      data: user.toJSON(),
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message || "Lỗi cập nhật thông tin.",
    });
  }
};

// PUT /user/change-password — Chỉ cần newPassword (user từ JWT, coi như đã đúng email)
exports.changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Vui lòng nhập mật khẩu mới.",
      });
    }
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "Không tìm thấy người dùng.",
      });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.status(200).json({
      status: "success",
      message: "Đổi mật khẩu thành công.",
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message || "Lỗi đổi mật khẩu.",
    });
  }
};
