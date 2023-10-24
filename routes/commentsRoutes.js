const express = require("express");
const router = express.Router();
const {
  postComment,
  deleteComment,
} = require("../controllers/commentsController");
const validateToken = require("../middleware/validateTokenHandler");

// POST
// @desc post a comment
// @route POST /comments/postComment
// @access private
router.post("/postComment", validateToken, async (req, res) => {
  try {
    const { postId, comment } = req.body;

    if (!comment) {
      res.status(400);
      return res.json({ status: "error", error: "All fields are mandatory" });
    }
    // const user_id = req.user.id;

    await postComment(postId, comment, req.user.id, res, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to post comment" });
      }
      res
        .status(201)
        .json({ status: "success", message: "Comment posted successfully" });
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
});

// DELETE
// @desc delete a comment
// @route DELETE /comments/:commentId
// @access private
router.delete("/:commentId", validateToken, async (req, res) => {
  try {
    await deleteComment(req.user.id, req.params.commentId, res);

    res
      .status(201)
      .json({ status: "success", message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
});

module.exports = router;
