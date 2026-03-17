const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Helper tạo token JWT
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.SECRET_KEY,
    { expiresIn: "7d" }
  );
};

// POST /auth/register
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, phone} = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Vui lòng nhập đầy đủ họ tên, email và mật khẩu.",
      });
    }
    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({
        status: "fail",
        message: "Email này đã được đăng ký.",
      });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password: hashed,
      phone: phone ? String(phone).trim() : "",
    });
    const token = generateToken(user._id, user.email);
    return res.status(201).json({
      status: "success",
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message || "Lỗi đăng ký.",
    });
  }
};

// POST /auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Vui lòng nhập email và mật khẩu.",
      });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Email hoặc mật khẩu không đúng.",
      });
    }
    if (!user.isActive) {
      return res.status(403).json({
        status: "fail",
        message: "Tài khoản đã bị khóa.",
      });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        status: "fail",
        message: "Email hoặc mật khẩu không đúng.",
      });
    }
    const token = generateToken(user._id, user.email);
    return res.status(200).json({
      status: "success",
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message || "Lỗi đăng nhập.",
    });
  }
};

// POST /auth/forgot-password — Chỉ cần email + newPassword, đúng email thì đổi luôn
exports.forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Vui lòng nhập email và mật khẩu mới.",
      });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Email không tồn tại.",
      });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return res.status(200).json({
      status: "success",
      message: "Đặt lại mật khẩu thành công.",
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message || "Lỗi đặt lại mật khẩu.",
    });
  }
};
