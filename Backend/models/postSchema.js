// models/postSchema.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    // sessionId: {
    //   type: String,
    //   required: true,
    // },

    originalText: {
      type: String,
      required: true,
    },

    attachmentUrl: {
      type: String, // cloudinary link if user attaches media
    },

    // Classification fields (from GPT)
    classification: {
      type: String,
      enum: ["event", "lost_and_found", "announcement"],
      required: true,
    },

    // Structured fields for events
    eventDetails: {
      title: String,
      date: Date,
      location: String,
      description: String,
    },

    // Structured fields for lost & found
    lostAndFoundDetails: {
      item: String,
      description: String,
      contactInfo: String,
      lastSeenAt: String,
      lostDateTime: Date,
    },

    // Structured fields for announcements
    announcementDetails: {
      title: String,
      description: String,
    },

    // Engagement counts
    goingCount: {
      type: Number,
      default: 0,
    },
    interestedCount: {
      type: Number,
      default: 0,
    },
    notGoingCount: {
      type: Number,
      default: 0,
    },
    responses: {
  type: Map,
  of: String, // deviceId -> "going" | "interested" | "notGoing"
  default: {},
},
    likes: {
      type: Number,
      default: 0,
    },
      likedBy: {
    type: [String], // store deviceIds or sessionIds
    default: [],
  }, 

    // Comments (references to Comment schema)
    commentIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
