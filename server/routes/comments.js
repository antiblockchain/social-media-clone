const express = require("express");
const router = express.Router();
const User = require("../schemas/User");
const Comment = require("../schemas/Comment");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../vars");

// function authenticateToken(req, res, next) {
//   const authHeader = req.cookies.accessToken.toString();
//   const token = authHeader;

//   if (token == null) return res.status(401).json("Missing or invalid token");
//   jwt.verify(token, secretKey, (err, user) => {
//     console.error(err);
//     if (err) return res.status(403);
//     req.user = user;
//     next();
//   });
// }
// router.use(authenticateToken);

// router.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST", "PATCH", "DELETE"],
//     optionsSuccessStatus: 200,
//     credentials: true,
//   })
// );

//GET one
router.get("/:id", getComment, async (req, res) => {
  res.json(res.comment);
});

//GET all for post
router.get("/post/:id", async (req, res) => {
  let comments = await Comment.find({ postId: req.params.id });
  res.status(200).json(comments);
});
//CREATE
router.post("/:id", async (req, res) => {
  const decoded = jwt.verify(req.cookies?.accessToken?.toString(), secretKey);
  const user = await User.findById(decoded.id);

  const comment = new Comment({
    username: user.username,
    content: req.body.content,
    postId: req.params.id,
  });
  try {
    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// //UPDATE one
// router.patch("/:id", getPost, async (req, res) => {
//   if (req.body.title != null) {
//     res.post.title = req.body.title;
//   }
//   if (req.body.content != null) {
//     res.post.content = req.body.content;
//   }
//   try {
//     const updatedPost = await res.post.save();
//     res.json(updatedPost);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });
// //DELETE one
// router.delete("/:id", getPost, async (req, res) => {
//   try {
//     const decoded = jwt.verify(req.cookies?.accessToken?.toString(), secretKey);
//     const user = await User.findById(decoded.id);
//     if (user?.username == res.post.username) {
//       //await res.post.remove();
//       await Post.deleteOne({ _id: res.post._id });
//       res.json({ message: "Successfully deleted" });
//     } else {
//       res.status(403).json({ message: "No access to post" });
//     }
//     // await res.post.remove();
//     // res.json({ message: "Successfully deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

async function getComment(req, res, next) {
  let comment;
  try {
    comment = await Comment.findById(req.params.id);
    if (comment == null) {
      return res.status(404).json({ message: "comment not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.comment = comment;
  next();
}
module.exports = router;

// const commentSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   content: { type: String, required: true },
//   postId: { type: String, required: true },
//   date: { type: Date, required: true, default: Date.now() },
//   replyTo: { type: String, required: false },
// });
