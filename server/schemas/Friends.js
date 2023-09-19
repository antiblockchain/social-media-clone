const mongoose = require("mongoose");

const friendsSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isFriend: { type: Boolean, required: true, default: false },
  date: { type: Date, required: true, default: Date.now() },
});
module.exports = mongoose.model("Friends", friendsSchema);
