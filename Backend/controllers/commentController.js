const Comment = require("../models/comment");
const logger = require("../utils/logger");

// Add a new comment to a post
exports.addComment = async (req, res) => {
  try {
    logger.info("Adding a new comment");
    const { content, parentId } = req.body;
    const { postId } = req.params;

    const newComment = new Comment({
      postId,
      parentId: parentId || null,
      content,
    });

    await newComment.save();
    logger.info(`Added comment with ID ${newComment._id}`);
    res.status(201).json({ message: "✅ Comment added", comment: newComment });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "❌ Error adding comment", error: err.message });
  }
};

// Get all comments for a post (nested structure)
exports.getComments = async (req, res) => {
  try {
    logger.info("Fetching comments");
    const { postId } = req.params;

    // Fetch all comments for this post
    const comments = await Comment.find({ postId }).lean();

    // Convert flat list -> nested structure
    const buildTree = (parentId = null) => {
      logger.info(`Building tree for parent ID ${parentId}`);
      return comments
        .filter(c => String(c.parentId) === String(parentId))
        .map(c => ({ ...c, replies: buildTree(c._id) }));
    };
    logger.info("Built tree");
    res.json(buildTree());
  } catch (err) {
    logger.error('Error getting comments ',err);
    res.status(500).json({ message: "❌ Error fetching comments", error: err.message });
  }
};

// Delete a comment (and its replies)
exports.deleteComment = async (req, res) => {
  try {
    logger.info(`Deleting comment with ID ${req.params.id}`);
    const { id } = req.params;

    // recursive delete helper
    const deleteRecursively = async (commentId) => {
      const replies = await Comment.find({ parentId: commentId });
      for (let reply of replies) {
        await deleteRecursively(reply._id);
      }
      await Comment.findByIdAndDelete(commentId);
      logger.info(`Deleted comment with ID ${commentId}`);
    };

    await deleteRecursively(id);
    logger.info(`Deleted comment and its replies`);

    res.json({ message: "🗑️ Comment deleted successfully" });
  } catch (err) {
    logger.error('Error deleting comment',err,);
    res.status(500).json({ message: "❌ Error deleting comment", error: err.message });
  }
};
