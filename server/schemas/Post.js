const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  username: { type: String, required: true },
  content: { type: String, required: true },
  isImage: { type: Boolean, required: true, default: false },
  date: { type: Date, required: true, default: Date.now() },
});
module.exports = mongoose.model("Post", postSchema);
