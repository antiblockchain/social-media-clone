const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const router = express.Router();
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { secretKey } = require("./vars");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(secretKey));

app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

function authenticateToken(req, res, next) {
  const authHeader = req.cookies.accessToken.toString();
  const token = authHeader;

  if (token == null) return res.status(401).json("Missing or invalid token");
  jwt.verify(token, secretKey, (err, user) => {
    console.error(err);
    if (err) return res.status(403);
    req.user = user;
    next();
  });
}
router.use(authenticateToken);

function checkTokenExpiration(req, res, next) {
  const token = req.cookies.accessToken; // Assuming you store the token in a cookie
  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const currentTime = Math.floor(Date.now() / 1000); // Unix timestamp in seconds

    if (decoded.exp && decoded.exp < currentTime) {
      // Token has expired
      return res.status(401).json({ message: "Token has expired" });
    }
    const renewalThreshold = 300;

    if (decoded.exp && decoded.exp - currentTime < renewalThreshold) {
      const newToken = jwt.sign({ userId: decoded.userId }, secretKey, {
        expiresIn: "30m",
      });

      res.cookie("accessToken", newToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 500, //30 mins in ms
      });
    }

    // Token is valid, continue processing the request
    next();
  });
}

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

//Connect to DB
mongoose.connect("mongodb://localhost/facebookclonedb");

//Initialize validation

router.use(express.json());
//AUTH
const auth = require("./routes/auth");
app.use("/", auth);
//Now enable auth middleware
app.use(checkTokenExpiration);

const post = require("./routes/posts");
app.use("/post", post);

const profile = require("./routes/profile");
app.use("/profile", profile);

const comment = require("./routes/comments");
app.use("/comment", comment);

const like = require("./routes/likes");
app.use("/like", like);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ message: err.message });
});

app.listen(3000, () => console.log("server started"));

module.exports = router;
