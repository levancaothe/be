const express = require("express");
const router = express.Router();
const commentController = require("../controller/commentController");
const authentication = require("../middlewares/authMiddleware");

router.get("/", commentController.getCommentsByStoryId); // query storyId — public
router.post("/", authentication, commentController.createComment);
router.delete("/:commentId", authentication, commentController.deleteComment);

module.exports = router;
