const express = require("express");
const router = express.Router();
const chapterController = require("../controller/chapterController");

router.get("/", chapterController.getChaptersByStoryId); // query: storyId
router.post("/increment-views", chapterController.incrementStoryViews);
router.get("/:chapterId", chapterController.getChapterById);

module.exports = router;
