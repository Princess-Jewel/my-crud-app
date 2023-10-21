const express = require("express");
const router = express.Router();
const {
  createPost,
  deletePost,
  editPost,
  getPostsAndComments,
} = require("../models/postsModel");
const validateToken = require("../middleware/validateTokenHandler");


// POST
// @desc create a post
// @route POST /posts/create_post
// @access private
router.post("/create_post", validateToken, async (req, res) => {
    try {
      const { post_title, post_content} = req.body;
      if (!post_title || !post_content) {
        res.status(400);
        return res.json({ status: "error", error: "All fields are mandatory" });
      }
      const post_email = req.user.email;
      const user_id = req.user.id;
      await createPost(post_title, post_content, post_email, user_id);
      res
        .status(201)
        .json({ status: "success", message: "Post created successfully" });
    } catch (error) {
      res.status(500).json({ status: "error", error: "Internal server error" });
    }
  });
  
  // DELETE
  // @desc delete a post
  // @route DELETE /posts/:id
  // @access private
  router.delete("/:id", validateToken, async (req, res) => {
    try {
      const user_id = req.user.id;
      const affectedRows = await deletePost(user_id, req.params.id);
      if (affectedRows == 0) res.status(404).json("No record found");
      else
        res
          .status(201)
          .json({ status: "success", message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ status: "error", error: "Internal server error" });
    }
  });
  
  // UPDATE/EDIT
  // @desc update/edit a post
  // @route PUT /posts/:id
  // @access private
  router.put("/:id",validateToken, async (req, res) => {
    try {
      const { post_title, post_content} = req.body;
      const user_id = req.user.id;
      const affectedRows = await editPost(
        post_title,
        post_content,
        user_id,
        req.params.id
      );
    
      if (affectedRows == 0) res.status(404).json("No post/record found");
      else
        res
          .status(201)
          .json({ status: "success", message: "Post updated successfully" });
    } catch (error) {
      res.status(500).json({ status: "error", error: "Internal server error" });
    }
  });



  // GET
  // @desc get/get all post
  // @route GET /posts/
  // @access private
    router.get("/",validateToken, async (req, res, next) => {
    try {
      const Rows = await getPostsAndComments();
      if (Rows == 0) res.status(404).json("No post/record found");
      else
        res
          .status(201)
          .json({ status: "success", message: "All Posts fetched successfully", data: Rows });
    } catch (error) {
      res.status(500).json({ status: "error", error: "Internal server error" });
    }
  })



  module.exports = router;