const db = require("../config/databaseConnection");






function postComment(id, comment, user_id, callback) {
  // First, retrieve the post_id associated with the comment
  db.query("SELECT id FROM posts_table WHERE id = ?", [id], (err, rows) => {
    if (err) {
      callback(err, null);
    } else if (rows.length === 0) {
      callback("Post not found", null);
    } else {
      const post_id = rows[0].id;

      if (parseInt(post_id) !== parseInt(id)) {
        callback("Unauthorized", null);
      } else {
        db.query(
          "INSERT INTO comments_table (comment, user_id, post_id) VALUES (?,?,?)",
          [comment, user_id, post_id],
          (err, result) => {
            if (err) {
              callback(err, null);
            } else if (result.affectedRows === 1) {
              callback(null, {
                message: "Comment posted successfully",
                id: result.insertId,
              });
            } else {
              callback("Comment post failed", null);
            }
          }
        );
      }
    }
  });
};


function deleteComment(user_id, id) {
  return new Promise((resolve, reject) => {
    // First, retrieve the user_id associated with the post
    db.query(
      "SELECT user_id FROM comments_table WHERE user_id = ?",
      [user_id],
      (err, rows) => {
        if (err) {
          reject(err);
        } else if (rows.length === 0) {
          reject("Comment not found");
          // Handle the case where the post doesn't exist
        } else {
          const postUserId = rows[0].user_id;

          if (postUserId !== user_id) {
            reject("Unauthorized");
            // User doesn't have permission to delete this comment
          } else {
            // User is authorized, proceed with the deletion
            db.query(
              "DELETE FROM comments_table WHERE id = ?",
              [id],
              (err, result) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(result.affectedRows);
                }
              }
            );
          }
        }
      }
    );
  });
}

module.exports = {
  postComment,
  deleteComment
};
