const dotenv=require("dotenv")
const jwt = require("jsonwebtoken");

dotenv.config()

const gerateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "5d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
};

module.exports = gerateTokenAndSetCookie;
