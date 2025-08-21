const Post = require("../models/postSchema");
const OpenAI = require("openai");
const logger = require("../utils/logger");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 1. Get posts by type
exports.getPostsByType = async (req, res) => {
  try {
    const { type } = req.query;
    logger.info("Fetching posts of type:", type);
    if (!["event", "lost_and_found", "announcement"].includes(type)) {
      return res.status(400).json({ error: "Invalid type" });
    }

    const posts = await Post.find({ classification: type }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    logger.error("❌ Error in getPostsByType:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 2. Classify raw text using GPT
exports.classifyText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    // Call GPT for classification
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // cheaper & fast, or use gpt-4o
      messages: [
        {
          role: "system",
          content:  `You are a classifier for campus feed posts. 
Classify into exactly one of: ["event", "lost_and_found", "announcement"]. 
Also return a toxicityScore (0-100).

Schema mapping:
- Common:
  { classification, toxicityScore }
- If classification = "event":
  eventDetails: { title, date (ISO format), location, description }
- If classification = "lost_and_found":
  lostAndFoundDetails: { item, description, contactInfo, lastSeenAt, lostDateTime (ISO format if available) }
- If classification = "announcement":
  announcementDetails: { title, description }

Do not invent extra fields outside this schema. 
If some detail is missing, return null for that field.`,
        },
        { role: "user", content: text },
      ],
      temperature: 0,
    });

    const classification = response.choices[0].message.content;
    const parsed = JSON.parse(classification); // GPT returns JSON

    res.json(parsed);
  } catch (error) {
    console.error("❌ Error in classifyText:", error);
    res.status(500).json({ error: "Error classifying post" });
  }
};

// 3. Create a post after frontend review
exports.createPost = async (req, res) => {
  try {
    const postData = req.body;

    // Validate required fields
    if (!postData.originalText || !postData.classification) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newPost = new Post(postData);
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error("❌ Error creating post:", error);
    res.status(500).json({ error: "Error creating post" });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } }, // increment likes by 1
      { new: true }
    );

    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};