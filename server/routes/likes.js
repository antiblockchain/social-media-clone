const express = require("express");
const router = express.Router();
const User = require("../schemas/User");
const Post = require("../schemas/Post");
const Comment = require("../schemas/Comment");
const Like = require("../schemas/Like");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../vars");

// function authenticateToken(req, res, next) {
//   const token = req.cookies.accessToken.toString();

//   if (!token) return res.status(401).json("Missing or invalid token");
//   jwt.verify(token, secretKey, (err, user) => {
//     if (err) return res.status(403);
//     req.user = user;
//     next();
//   });
// }
// router.use(authenticateToken);

// router.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
//     optionsSuccessStatus: 200,
//     credentials: true,
//   })
// );

router.get("/", getLikes, async (req, res) => {
  res.status(200).json(res.currentLikes);
});

//GET all for post
router.get("/post/:id", async (req, res) => {
  try {
    let likes = await Like.find({ postId: req.params.id });
    res.status(200).json(likes.length);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//CREATE
router.post("/", checkLikes, async (req, res) => {
  try {
    if (res.likes) {
      const like = new Like({
        userId: req.user.id.toString(),
        postId: req.body.postId.toString(),
      });
      const newLike = await like.save();
      res.status(201).json(newLike);
    } else {
      res.status(401).json({ message: "Already liked comment" });
    }
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
//DELETE one
router.delete("/:id", checkLikes, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user?.username == res.post.username) {
      await Post.deleteOne({ _id: res.post._id });
      res.json({ message: "Successfully deleted" });
    } else {
      res.status(403).json({ message: "No access to post" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function checkLikes(req, res, next) {
  try {
    existingLike = await Like.findOne({
      userId: req.user.id,
      postId: req.body.postId,
    });
    if (existingLike) {
      res.likes = false;
    } else {
      res.likes = true;
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
}

async function getLikes(req, res, next) {
  try {
    currentLikes = await Like.countDocuments({
      postId: req.body.postId,
    });
    res.currentLikes = currentLikes;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
module.exports = router;

// const likeSchema = new mongoose.Schema({
//     username: { type: String, required: true },
//     postId: { type: String, required: true },
//     date: { type: Date, required: true, default: Date.now() },
//   });
