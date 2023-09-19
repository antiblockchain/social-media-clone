var express = require("express");
var cookieParser = require("cookie-parser");
var router = express.Router();
const { body, validationResult } = require("express-validator");
const session = require("express-session");
const User = require("../schemas/User");
const passport = require("passport");
const JsonStrategy = require("passport-json").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../vars");

router.use(express.json());
router.use(cookieParser());
router.use(express.urlencoded({ extended: false }));

// router.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST", "PATCH", "DELETE"],
//     optionsSuccessStatus: 200,
//     credentials: true,
//   })
// );

//JWT options
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretKey;
opts.issuer = "localhost:3000";
opts.audience = "localhost:5173";

//Connect to DB
mongoose.connect("mongodb://localhost/facebookclonedb");

//Passport config
passport.use(
  new JsonStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user);
        } else {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" });
        }
      });
    } catch (err) {
      return done(err);
    }
  })
);

//Serialization
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

//Initialize passport
router.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
  })
);

router.use(passport.initialize());
router.use(passport.session());

//Pass on request
router.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

//Routes

//Sign up
router.post(
  "/sign-up",
  body("confirmPassword").custom((value, { req }) => {
    if (value != req.body.password) {
      throw new Error("Passwords do not match.");
    } else {
      return true;
    }
  }),
  body("username").custom(async (value, { req }) => {
    return User.findOne({ username: value }).then((userDoc) => {
      if (userDoc) {
        throw new Error("Username already exists");
      } else {
        return true;
      }
    });
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alert = errors.array();
      res.status(500).json({ message: alert.message });
    } else {
      let username = req.body.username.trim();
      bcrypt.hash(req.body.password.trim(), 10, async (err, hashedPassword) => {
        if (err) {
          res.status(500).json({ message: err });
        } else {
          const user = new User({
            username: username,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
          });
          user.save();
        }
      });
      res.status(200).json({ message: "Successfully created user." });
    }
  }
);

//Log-in
router.post("/log-in", passport.authenticate("json"), function (req, res) {
  const token = jwt.sign({ id: req.user._id }, secretKey, { expiresIn: "30m" });

  const { password, ...others } = req.user._doc;
  res.cookie("accessToken", token, {
    httpOnly: true,
    maxAge: 30 * 60 * 1000,
  });

  res.status(200).json({
    message: "Successfully logged in",
    user: others,
    cookies: req.cookies,
  });
});

//Sign out
router.post("/sign-out", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.cookie("accessToken", "none", {
      expires: new Date(Date.now() + 5 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ message: "Successfully logged out." });
  });
});

router.get("/user/:id", (req, res) => {
  const userId = req.id;
});

module.exports = router;
