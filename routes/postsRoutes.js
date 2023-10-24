const express = require("express");
const router = express.Router();
const {
  createPost,
  deletePost,
  editPost,
  getPostsAndComments,
} = require("../controllers/postsController");
const validateToken = require("../middleware/validateTokenHandler");

// POST
// @desc create a post
// @route POST /posts/createPost
// @access private
router.post("/createPost", validateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      res.status(400);
      return res.json({ status: "error", error: "All fields are mandatory" });
    }
    const email = req.user.email;
    const userId = req.user.id;
    await createPost(title, content, email, userId, res);
    res
      .status(201)
      .json({ status: "success", message: "Post created successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
});

// DELETE
// @desc delete a post
// @route DELETE /posts/:postId
// @access private
router.delete("/:postId", validateToken, async (req, res) => {
  try {
    await deletePost(req.user.id, req.params.postId, res);
  } catch (error) {
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
});

// UPDATE/EDIT
// @desc update/edit a post
// @route PUT /posts/:postId
// @access private
router.put("/:postId", validateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    await editPost(title, content, req.user.id, req.params.postId, res);

    res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
});


// GET
// @desc get/get all post
// @route GET /posts/
// @access private
router.get("/", validateToken, async (req, res, next) => {
  try {
    const processedData = await getPostsAndComments();
    // console.log("processedData", processedData)
    if (processedData == 0) res.status(404).json("No post/record found");
    else
      res.status(201).json({
        status: "success",
        message: "All Posts fetched successfully",
        data: processedData,
      });
  } catch (error) {
    console.error("lanre is here", error);
    res.status(500).json({ status: "error", error: "here Internal server error" });
  }
});

module.exports = router;
