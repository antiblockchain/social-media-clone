const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  content: { type: String, required: true },
  postId: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now() },
  replyTo: { type: String, required: false },
});
module.exports = mongoose.model("Comment", commentSchema);
