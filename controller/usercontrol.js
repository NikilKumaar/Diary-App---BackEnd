const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

const { createTransport } = require("nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

function getUserMail(request) {
  return User.findOne({ email: request.body.email });
}

function getuserdetails(id) {
  return User.findById(id).select("_id firstname lastname email");
}

function generateToken(id) {
  return jwt.sign({ id }, process.env.SecretKey);
}

// Route to handle "forgot password" request
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Check if email exists in the database
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  //crypto.randomBytes(20).toString('hex');
  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetToken = resetToken;
  await user.save();

  //Send email with reset token
  const feurl = process.env.FrontendUrl;
  const resetUrl = `${feurl}reset/${resetToken}`;
  var transporter = createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.GmailUser,
      pass: process.env.GmailPassword,
    },
  });

  var mailOptions = {
    from: "nikilnike666@gmail.com",
    to: email,
    subject: "Dairy Application Reset Password",
    html: `<h1>Click the Link to Reset Password</h1><h2>This Link expires in 2 hours</h2><h2>Click on the link to reset your password</h2><h3>${resetUrl}</h3>`,
  };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  res
    .status(200)
    .json({
      message: "A link to reset your password have been sent to your email.",
    });
};

//  Route to handle password reset request
const resetPassword = async (req, res) => {
  const { password } = req.body;

  const user = await User.findOne({ token: req.params.resetToken });

  if (!user) {
    return res.status(400).json({ message: "Invalid token 1" });
  }

  // Update password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.resetToken = null;
  await user.save();

  res.status(200).json({ message: "Password reset successful" });
};

module.exports = {
  forgotPassword,
  resetPassword,
  getUserMail,
  getuserdetails,
  generateToken,
};