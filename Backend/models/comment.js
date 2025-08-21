const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({


  userId:{

    type:String,
    required:true

  },
  postId: { 
     type: mongoose.Schema.Types.ObjectId,
     ref: "Post", required: true
     },
  parentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Comment", default: null },
  content: { 
    type: String, 
    required: true },
  reactions: {
    like: { type: Number, default: 0 },
    love: { type: Number, default: 0 },
    laugh: { type: Number, default: 0 },
    wow: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Comment", commentSchema);
