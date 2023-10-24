const db = require("../config/databaseConnection");
const Comments = require("../models/comments");
const Posts = require("../models/posts");

function postComment(postId, comment, userId, res) {
  // First, find the post by its id
  Posts.findByPk(postId)
    .then(post => {
      if (!post) {
        res.status(401).json({ message: "Post not found" });
        return;
      }
      // Create a new comment associated with the post
      Comments.create({ comment, userId, postId }).then(createdComment => {
        res.status(200).json({
          message: "Comment posted successfully",
          id: createdComment.id,
        });
      });
    })
    .catch(err => {
      res.status(500).json({ status: "error", error: err });
    });
}


function deleteComment(userId, id, res) {
  try {
    return Comments.findOne({ where: { userId, id } }).then(comment => {
      if (!comment) {
        res.status(401).json({ message: "Comment not found" });
        return;
      }

      // Check if the user is authorized to delete the comment
      if (comment.userId !== userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      // User is authorized, proceed with comment deletion
      return Comments.destroy({ where: { id } });
    });
  } catch (error) {
    // Handle any unexpected errors
    res.status(500).json({ message: "Internal server error" });
  }
}


module.exports = {
  postComment,
  deleteComment,
};
