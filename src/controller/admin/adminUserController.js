const User = require("../../models/user");
const bcrypt = require("bcrypt");

// GET /admin/users — Danh sách user (phân trang)
exports.list = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.min(100, Math.max(1, parseInt(limit, 10)));
    const perPage = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const filter = {};
    if (search && search.trim()) {
      filter.$or = [
        { fullName: new RegExp(search.trim(), "i") },
        { email: new RegExp(search.trim(), "i") },
      ];
    }
    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(perPage).lean(),
      User.countDocuments(filter),
    ]);
    const list = users.map((u) => {
      const { password, resetPasswordToken, resetPasswordExpires, ...rest } = u;
      return rest;
    });
    return res.status(200).json({
      status: "success",
      data: { list, total, page: Math.max(1, parseInt(page, 10)), limit: perPage, totalPages: Math.ceil(total / perPage) || 1 },
    });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message || "Lỗi lấy danh sách user." });
  }
};

// GET /admin/users/:id
exports.getById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -resetPasswordToken -resetPasswordExpires").lean();
    if (!user) return res.status(404).json({ status: "fail", message: "Không tìm thấy user." });
    return res.status(200).json({ status: "success", data: user });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message });
  }
};

// POST /admin/users
exports.create = async (req, res) => {
  try {
    const { fullName, email, password, role, phone, isActive } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ status: "fail", message: "Vui lòng nhập đầy đủ họ tên, email và mật khẩu." });
    }
    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) return res.status(400).json({ status: "fail", message: "Email đã tồn tại." });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password: hashed,
      role: role && ["Admin", "Manager", "Customer"].includes(role) ? role : "Customer",
      phone: phone ? String(phone).trim() : "",
      isActive: isActive !== false,
    });
    return res.status(201).json({ status: "success", data: user.toJSON() });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message || "Lỗi tạo user." });
  }
};

// PUT /admin/users/:id
exports.update = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ status: "fail", message: "Không tìm thấy user." });
    const { fullName, email, password, role, phone, isActive } = req.body;
    if (fullName !== undefined) user.fullName = fullName.trim();
    if (email !== undefined) {
      const existing = await User.findOne({ email: email.trim().toLowerCase(), _id: { $ne: user._id } });
      if (existing) return res.status(400).json({ status: "fail", message: "Email đã được dùng bởi user khác." });
      user.email = email.trim().toLowerCase();
    }
    if (password && password.trim()) user.password = await bcrypt.hash(password, 10);
    if (role !== undefined && ["Admin", "Manager", "Customer"].includes(role)) user.role = role;
    if (phone !== undefined) user.phone = String(phone).trim();
    if (isActive !== undefined) user.isActive = !!isActive;
    await user.save();
    return res.status(200).json({ status: "success", data: user.toJSON() });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message || "Lỗi cập nhật user." });
  }
};

// DELETE /admin/users/:id
exports.remove = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ status: "fail", message: "Không tìm thấy user." });
    return res.status(200).json({ status: "success", message: "Đã xóa user." });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message });
  }
};
