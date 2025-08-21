const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

// Add comment to a post
router.post("/:postId", commentController.addComment);

// Get all comments for a post
router.get("/:postId", commentController.getComments);

// Delete a comment
router.delete("/:id", commentController.deleteComment);

module.exports = router;
