const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const toxicityMiddleware=require('../middlewares/toxicityMiddleware');


// Add comment to a post
router.post("/:postId",toxicityMiddleware, commentController.addComment);

// Get all comments for a post
router.get("/:postId", commentController.getComments);

// Delete a comment
router.delete("/:id", commentController.deleteComment);

module.exports = router;
