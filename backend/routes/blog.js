const express = require("express");

const checkAuth = require("../middleware/check-auth");

const blogController =  require("../controllers/blog");

const router = express.Router();

router.post("", checkAuth, blogController.createBlog);

router.get("", checkAuth, blogController.getBlogs);

router.get("/:id", checkAuth, blogController.getBlog);

router.put("/:id", checkAuth, blogController.updateBlog);

router.delete("/:id", checkAuth, blogController.deleteBlog);

module.exports = router;
