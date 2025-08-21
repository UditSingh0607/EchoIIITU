// routes/postRoutes.js
const express = require("express");
const router = express.Router();
const { classifyText,createPost,getPostsByType,likePost,respondToEvent } = require("../controllers/postController");

// Route: classify text via GPT (before saving)
router.post("/classify", classifyText);

// Route: add a post (after user confirms GPT classification)
router.post("/",createPost);


// Route: get posts by type
router.get("/type/:classification",getPostsByType);

// Route: update likes and reponses
router.patch("/:id/like",likePost);
router.patch("/:id/respond", respondToEvent);
module.exports = router;
