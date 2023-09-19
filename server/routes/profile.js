const express = require("express");
const router = express.Router();
const User = require("../schemas/User");
const Friends = require("../schemas/Friends");
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

//Get all pending friend requests

router.get("/friend-requests-pending", getFriendRequests, (req, res) => {
  if (!res.friendRequests) {
    res.status(200).json("No friend requests");
  }
  res.status(200).json(res.friendRequests);
});

async function getFriendRequests(req, res, next) {
  try {
    const decoded = jwt.verify(req.cookies?.accessToken?.toString(), secretKey);
    const user = await User.findById(decoded.id);
    const userId = user._id;

    const friendRequests = await Friends.find({
      recipient: userId,
      isFriend: false,
    }).populate("requester");

    res.friendRequests = friendRequests;

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

//Search for a query

router.get("/search", async (req, res) => {
  try {
    const searchTerm = req.query.query;

    // Use aggregation to calculate relevance score
    const users = await User.aggregate([
      {
        $match: {
          $or: [
            { firstName: { $regex: new RegExp(searchTerm, "i") } },
            { lastName: { $regex: new RegExp(searchTerm, "i") } },
          ],
        },
      },
      {
        $addFields: {
          // Calculate relevance score based on name similarity
          relevanceScore: {
            $add: [
              {
                $cond: {
                  if: { $eq: ["$firstName", searchTerm] },
                  then: 2, // Exact match gets a higher score
                  else: {
                    $cond: {
                      if: {
                        $regexMatch: {
                          input: "$firstName",
                          regex: new RegExp(searchTerm, "i"),
                        },
                      },
                      then: 1, // Partial match gets a lower score
                      else: 0, // No match gets no score
                    },
                  },
                },
              },
              {
                $cond: {
                  if: { $eq: ["$lastName", searchTerm] },
                  then: 2, // Exact match gets a higher score
                  else: {
                    $cond: {
                      if: {
                        $regexMatch: {
                          input: "$lastName",
                          regex: new RegExp(searchTerm, "i"),
                        },
                      },
                      then: 1, // Partial match gets a lower score
                      else: 0, // No match gets no score
                    },
                  },
                },
              },
            ],
          },
        },
      },
      {
        $sort: { relevanceScore: -1 }, // Sort by relevance score in descending order
      },
    ]);

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Get friends of a user
router.get("/friends/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const friendsList = await Friends.find({
      $or: [{ requester: userId }, { recipient: userId }],
      isFriend: true,
    });

    const friendDetails = [];

    for (const friend of friendsList) {
      const friendId =
        friend.requester.toString() === userId
          ? friend.recipient
          : friend.requester;

      const friendUser = await User.findById(friendId, {
        firstName: 1,
        lastName: 1,
        _id: 1,
      });

      if (friendUser) {
        friendDetails.push({
          firstName: friendUser.firstName,
          lastName: friendUser.lastName,
          _id: friendUser._id,
        });
      }
    }

    res.status(200).json(friendDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add/request a friend
router.post("/friend/:id", async (req, res) => {
  try {
    const requesterId = jwt.verify(
      req.cookies?.accessToken?.toString(),
      secretKey
    ).id;
    const recipient = req.params.id;

    // Combine friend queries for requester and recipient
    const friends = await Friends.find({
      $or: [
        { requester: requesterId, recipient },
        { requester: recipient, recipient: requesterId },
      ],
    });

    if (friends.length === 0) {
      // No existing friend requests or friendships
      const newFriendRequest = new Friends({
        requester: requesterId.toString(),
        recipient: recipient.toString(),
      });
      await newFriendRequest.save();

      const requesterUser = await User.findById(requesterId);
      requesterUser.friends.push(newFriendRequest._id);
      await requesterUser.save();

      res.status(200).json({ message: "Sent friend request to user" });
    } else {
      // Handle existing friend requests or friendships
      const friend = friends[0]; // Assuming there can be only one entry
      if (friend.isFriend) {
        res.status(400).json({ message: "Already friends with user" });
      } else if (friend.requester === requesterId) {
        res.status(400).json({ message: "Friend request already sent" });
      } else {
        // Users have sent friend requests to each other, make them friends
        friend.isFriend = true;
        await friend.save();

        const requesterUser = await User.findById(requesterId);
        requesterUser.friends.push(friend._id);
        await requesterUser.save();

        res.status(200).json({ message: "Now friends with user" });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/friend/:id", (req, res) => {
  res.json("");
});

//Get a specific profile
router.get("/:id", getProfile, (req, res) => {
  const { password, username, admin, ...others } = res.profile._doc;
  res.json(others);
});

async function getProfile(req, res, next) {
  try {
    const profile = await User.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.profile = profile;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
