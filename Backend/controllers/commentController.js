const Comment = require("../models/comment");
const logger = require("../utils/logger");

// ✅ Add a new comment to a post
exports.addComment = async (req, res) => {
  try {
    logger.info("Adding a new comment");
    const { content, parentId } = req.body;
    const { postId } = req.params;

    const newComment = new Comment({
      postId,
      parentId: parentId || null,
      content,
      reactions: { like: 0, love: 0, laugh: 0, wow: 0 } // initialize counts
    });

    await newComment.save();
    logger.info(`Added comment with ID ${newComment._id}`);
    res.status(201).json({ message: "✅ Comment added", comment: newComment });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "❌ Error adding comment", error: err.message });
  }
};

// ✅ Get all comments for a post (nested structure)
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
    logger.error("Error getting comments ", err);
    res.status(500).json({ message: "❌ Error fetching comments", error: err.message });
  }
};

// ✅ Delete a comment (and its replies)
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
    logger.info("Deleted comment and its replies");

    res.json({ message: "🗑️ Comment deleted successfully" });
  } catch (err) {
    logger.error("Error deleting comment", err);
    res.status(500).json({ message: "❌ Error deleting comment", error: err.message });
  }
};

// ✅ Add a reaction to a comment
exports.addReaction = async (req, res) => {
  try {
    const { id } = req.params;       // commentId
    const { type } = req.body;       // e.g. "like", "love", "laugh", "wow"
    const userId = req.userId;       // 👈 user identity (cookie/device ID)

    logger.info(`Adding ${type} reaction by ${userId} to comment ${id}`);

    if (!["like", "love", "laugh", "wow"].includes(type)) {
      return res.status(400).json({ message: "❌ Invalid reaction type" });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "❌ Comment not found" });
    }

    // 1. Check if user already reacted with this type
    const alreadyReacted = comment.reactions[type].includes(userId);

    if (alreadyReacted) {
      // Toggle off → remove reaction
      comment.reactions[type] = comment.reactions[type].filter(uid => uid !== userId);
      await comment.save();
      logger.info(`User ${userId} removed ${type} reaction`);
      return res.json({ message: `✅ ${type} reaction removed`, comment });
    }

    // 2. Otherwise, remove user from all other reaction arrays
    Object.keys(comment.reactions).forEach(key => {
      comment.reactions[key] = comment.reactions[key].filter(uid => uid !== userId);
    });

    // 3. Add userId to the chosen reaction type
    comment.reactions[type].push(userId);

    await comment.save();
    logger.info(`User ${userId} reacted with ${type}`);
    res.json({ message: `✅ ${type} reaction added`, comment });
  } catch (err) {
    logger.error("Error adding reaction", err);
    res.status(500).json({ message: "❌ Error adding reaction", error: err.message });
  }
};

