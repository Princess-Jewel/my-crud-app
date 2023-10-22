const db = require("../config/databaseConnection");

function createPost(post_title, post_content, post_email, user_id) {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO posts_table (post_title, post_content, post_email, user_id) VALUES (?,?,?,?)",
      [post_title, post_content, post_email, user_id],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

function deletePost(user_id, id) {
  return new Promise((resolve, reject) => {
    // First, retrieve the user_id associated with the post
    db.query(
      "SELECT user_id FROM posts_table WHERE user_id = ? and id = ?",
      [user_id, id],
      (err, rows) => {
        if (err) {
          reject(err);
        } else if (rows.length === 0) {
          reject("Post not found");
          
        } else {
          const postUserId = rows[0].user_id;

          if (postUserId !== user_id) {
            reject("Unauthorized");
         
          } else {
          
            db.query(
              "DELETE FROM posts_table WHERE id = ?",
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

function editPost(post_title, post_content, user_id, id) {
  return new Promise((resolve, reject) => {
    // First, retrieve the user_id associated with the post
    db.query(
      "SELECT user_id FROM posts_table WHERE user_id = ?",
      [user_id],
      (err, rows) => {
        if (err) {
          reject(err);
        } else if (rows.length === 0) {
          reject("Post not found");
        } else {
          const postUserId = rows[0].user_id;

          if (postUserId !== user_id) {
         
            reject("Unauthorized"); 
          } else {
            db.query(
              "UPDATE posts_table SET post_title = ?, post_content = ? WHERE id = ?",
              [post_title, post_content, id],
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
};


function getPostsAndComments() {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT posts.post_title, posts.post_content, comments.comment " +
        "FROM posts_table AS posts " +
        "LEFT JOIN comments_table AS comments " +
        "ON posts.id = comments.post_id " +
        "ORDER BY posts.id DESC",
      function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}


module.exports = {
  createPost,
  deletePost,
  editPost,
  getPostsAndComments,
};
