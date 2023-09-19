const express = require("express");
const router = express.Router();
const User = require("../schemas/User");
const Post = require("../schemas/Post");
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
//     methods: ["GET", "POST", "PATCH", "DELETE"],
//     optionsSuccessStatus: 200,
//     credentials: true,
//   })
// );

//Get all posts by friends of user

router.get("/friends", async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("friends");
    const friendIds = user.friends.map((friend) => friend._id);
    const friendPosts = await Post.find({ userId: { $in: friendIds } }).sort({
      date: -1,
    });
    res.status(200).json(friendPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//Get one post by ID
router.get("/:id", getPost, (req, res) => {
  res.json(res.post);
});

//Create post
router.post("/", async (req, res) => {
  const post = new Post({
    username: req.body.username,
    content: req.body.content,
  });
  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//UPDATE one
router.patch("/:id", getPost, async (req, res) => {
  if (req.body.title || req.body.content) {
    res.post.title = req.body.title;
    res.post.content = req.body.content;
    try {
      const updatedPost = await res.post.save();
      res.json(updatedPost);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
});
//DELETE one
router.delete("/:id", getPost, async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies?.accessToken?.toString(), secretKey);
    const user = await User.findById(req.user.id);
    if (user?.username == res.post.username) {
      //await res.post.remove();
      await Post.deleteOne({ _id: res.post._id });
      res.json({ message: "Successfully deleted" });
    } else {
      res.status(403).json({ message: "No access to post" });
    }
    // await res.post.remove();
    // res.json({ message: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getPost(req, res, next) {
  let post;
  try {
    post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.post = post;
  next();
}
module.exports = router;
