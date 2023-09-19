const crypto = require("crypto");

const secretKey = crypto.randomBytes(20).toString("hex");

module.exports = { secretKey };
