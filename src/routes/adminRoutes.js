const router = require("express").Router();
const requireAdmin = require("../middlewares/adminMiddleware");
const adminUser = require("../controller/admin/adminUserController");
const adminCategory = require("../controller/admin/adminCategoryController");
const adminStory = require("../controller/admin/adminStoryController");
const adminChapter = require("../controller/admin/adminChapterController");

router.use(requireAdmin);

// Users
router.get("/users", adminUser.list);
router.get("/users/:id", adminUser.getById);
router.post("/users", adminUser.create);
router.put("/users/:id", adminUser.update);
router.delete("/users/:id", adminUser.remove);

// Categories
router.get("/categories", adminCategory.list);
router.get("/categories/:id", adminCategory.getById);
router.post("/categories", adminCategory.create);
router.put("/categories/:id", adminCategory.update);
router.delete("/categories/:id", adminCategory.remove);

// Stories
router.get("/stories", adminStory.list);
router.get("/stories/:id", adminStory.getById);
router.post("/stories", adminStory.create);
router.put("/stories/:id", adminStory.update);
router.delete("/stories/:id", adminStory.remove);

// Chapters (query: storyId for list)
router.get("/chapters", adminChapter.list);
router.get("/chapters/:id", adminChapter.getById);
router.post("/chapters", adminChapter.create);
router.put("/chapters/:id", adminChapter.update);
router.delete("/chapters/:id", adminChapter.remove);

module.exports = router;
