const express = require("express");
const router = express.Router();
const favoriteController = require("../controller/favoriteController");
const authentication = require("../middlewares/authMiddleware");

router.use(authentication);

router.get("/", favoriteController.getMyWishlist);
router.get("/check/:storyId", favoriteController.checkWishlist);
router.post("/", favoriteController.addToWishlist);
router.delete("/:storyId", favoriteController.removeFromWishlist);

module.exports = router;
