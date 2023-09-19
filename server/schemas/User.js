const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  admin: { type: Boolean, required: true, default: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  pfpUrl: { type: String, required: false },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "Friends" }],
  date: { type: Date, required: true, default: Date.now() },
});
module.exports = mongoose.model("User", userSchema);
