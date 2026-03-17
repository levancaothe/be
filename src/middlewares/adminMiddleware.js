const User = require("../models/user");
const authentication = require("./authMiddleware");

const requireAdmin = (req, res, next) => {
  authentication(req, res, async () => {
    try {
      const user = await User.findById(req.user.userId).select("role").lean();
      if (user && user.role === "Admin") {
        req.user.role = user.role;
        return next();
      }
      return res.status(403).json({
        status: "fail",
        message: "Chỉ Admin mới được thực hiện thao tác này.",
      });
    } catch (err) {
      return res.status(500).json({ status: "fail", message: err.message });
    }
  });
};

module.exports = requireAdmin;
