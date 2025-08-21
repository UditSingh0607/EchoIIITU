const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null // for replies
  },
  content: {
    type: String,
    required: true
  },
  authorId: {
    type: String, // since no auth, can store cookie/device id
    default: "anonymous"
  },
  reactions: {
    like: { type: [String], default: [] },   // array of userIds
    love: { type: [String], default: [] },
    laugh: { type: [String], default: [] },
    wow: { type: [String], default: [] }
  },
  isToxic: {
    type: Boolean,
    default: false // in case we want to flag instead of blocking
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Comment", commentSchema);
