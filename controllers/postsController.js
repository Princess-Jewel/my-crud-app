const Posts  = require("../models/posts");
const  Comments  = require("../models/comments");

async function createPost(title, content, email, userId, res) {
  try {
    const newPost = await Posts.create({
      title,
      content,
      email,
      userId,
    });

    if (newPost) {
      return res.status(201).json({ error: "Post created successful" });
    } else {
      return res.status(401).json({ error: "Post creation failed" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
}

async function deletePost(userId, id, res) {
  try {
    if (!userId || !id) {
      return res.status(400).json({ error: "userId and post id are required" });
    }

    // Retrieve the post associated with the provided userId and id
    const post = await Posts.findOne({ where: { userId: userId, id: id } });

    // Check if the post doesn't exist
    if (!post) {
      return res.status(404).json({ error: "Post Not Found" });
    }

    // Check if the post belongs to the current user
    if (post.userId !== userId) {
      return res.status(401).json({ status: "error", error: "Unauthorized" });
    }

    // Delete the post
    await post.destroy();

    // Respond with a success message
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
}

async function editPost(title, content, userId, id, res) {
  try {
    // Find the post by userId and id
    const post = await Posts.findOne({ where: { userId: userId, id: id } });

    // Check if the post doesn't exist
    if (!post) {
      return res.status(404).json({ error: "Post Not Found" });
    }

    // Check if the post belongs to the current user
    if (post.userId !== userId) {
      return res.status(401).json({ status: "error", error: "Unauthorized" });
    }

    // Update the post with the new title and content
    await post.update({ title, content });

    // Respond with a success message
    res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
}

async function getPostsAndComments() {
  try {
  
    const posts = await Posts.findAll(
      {
      include: [
        {
          model: Comments,
          attributes: ["comment"],
        },
      ],
      order: [["id", "DESC"]],
    }
    );
    if (!posts) {
      return res.status(404).json({ error: "No Post(s)" });
    }

    // Process the data to separate comments
    const processedData = posts.map((post) => {
      const comments = post.Comments.map((comment) => comment.comment);
      return {
        title: post.title,
        content: post.content,
        comments,
      };
    });

    return processedData;
  } catch (error) {
    throw error; 
  }
}


module.exports = {
  createPost,
  deletePost,
  editPost,
  getPostsAndComments,
};
