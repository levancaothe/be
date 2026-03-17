const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authentication = require("../middlewares/authMiddleware");

router.use(authentication);

router.get("/profile", userController.getProfile);
router.put("/profile", userController.editProfile);
router.put("/change-password", userController.changePassword);

module.exports = router;
