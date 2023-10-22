const express = require("express");
const router = express.Router();
const {
  postComment,
  deleteComment,
} = require("../models/commentsModel");
const validateToken = require("../middleware/validateTokenHandler");



// POST
// @desc post a comment
// @route POST /comments/postComment
// @access private
router.post("/postComment",validateToken, async (req, res) => {
  try {
    const { id, comment } = req.body;

    if (!comment) {
      res.status(400);
      return res.json({ status: "error", error: "All fields are mandatory" });
    }
    // const user_id = req.user.id;

    await postComment(id, comment, req.user.id, (err, result) => {
      if (err) {
   
        return res
          .status(500)
          .json({ error: "Failed to post comment" });
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
// @route DELETE /comments/:id
// @access private
router.delete("/:id",validateToken, async (req, res) => {
  try {
    // const user_id = req.user.id;
    const affectedRows = await deleteComment(req.user.id, req.params.id);
    if (affectedRows == 0) res.status(404).json("No record found");
    else
      res
        .status(201)
        .json({ status: "success", message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
});

module.exports = router;
