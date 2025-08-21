const Post = require("../models/postSchema");
const OpenAI = require("openai");
const logger = require("../utils/logger");
const dotenv = require("dotenv");
const Tesseract = require("tesseract.js");
dotenv.config(); 
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function extractTextFromImage(url) {
  try {
    const result = await Tesseract.recognize(url, "eng");
    return result.data.text;
  } catch (err) {
    console.error("❌ OCR Error:", err);
    return "";
  }
}

// 1. Get posts by type
exports.getPostsByType = async (req, res) => {
  try {
    const { classification } = req.params;
    logger.info("Fetching posts of type:", classification);
    if (!["event", "lost_and_found", "announcement"].includes(classification)) {
      return res.status(400).json({ error: "Invalid type" });
    }

    const posts = await Post.find({ classification: classification }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    logger.error("❌ Error in getPostsByType:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 2. Classify raw text using GPT
exports.classifyText = async (req, res) => {
  try {
    const { text, attachmentURL } = req.body;
    if (!text && !attachmentURL) {
      return res.status(400).json({ error: "Text or attachmentURL is required" });
    }

    let finalText = text || "";

    // If image is present → extract text and append
     if (attachmentURL) {
      try {
        const extractedText = await extractTextFromImage(attachmentURL);
        finalText = `${finalText}\n${extractedText}`.trim();

        // Case: attachment exists but both text & extracted text are empty
        if (!finalText) {
          return res.status(400).json({ error: "❌ Can't read the image" });
        }
      } catch (err) {
        return res.status(500).json({ error: "❌ Can't read the image" });
      }
    }
    //const { text } = req.body;
    if (!finalText) return res.status(400).json({ error: "Text is required" });

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
    let parsed;
    try {
      parsed = JSON.parse(classification);
    } catch (err) {
      return res.status(500).json({ error: "Invalid AI response format" });
    }
    if (attachmentURL) parsed.attachmentURL = attachmentURL;

    if (parsed.classification === "unknown") {
      return res.status(422).json({
        error: "Could not classify post into a known type, Try changing the text or image.",
        details: parsed,
      });
    }
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

exports.respondToEvent = async (req, res) => {
  try {
    const deviceId = req.deviceId;
    if (!deviceId) return res.status(400).json({ error: "No deviceId found" });

    const { status } = req.body; // "going" | "interested" | "notGoing"
    if (!["going", "interested", "notGoing"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Ensure we track event responses per device
    if (!post.responses) post.responses = new Map(); // { deviceId: "going" }
    
    const prevStatus = post.responses.get(deviceId);

    // If user changes status
    if (prevStatus && prevStatus !== status) {
      if (prevStatus === "going") post.goingCount -= 1;
      if (prevStatus === "interested") post.interestedCount -= 1;
      if (prevStatus === "notGoing") post.notGoingCount -= 1;
    }

    // If new status (or changed)
    if (prevStatus !== status) {
      if (status === "going") post.goingCount += 1;
      if (status === "interested") post.interestedCount += 1;
      if (status === "notGoing") post.notGoingCount += 1;

      // Save new status
      post.responses.set(deviceId, status);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.error("❌ Error in respondToEvent:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.likePost = async (req, res) => {
  try {
    const deviceId = req.deviceId;
    if (!deviceId) return res.status(400).json({ error: "No deviceId found" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Check if device already liked
    if (post.likedBy.includes(deviceId)) {
      return res.status(400).json({ error: "Already liked by this device" });
    }

    // Otherwise increment and save deviceId
    post.likes += 1;
    post.likedBy.push(deviceId);
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
