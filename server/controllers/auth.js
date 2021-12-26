const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const secret = "KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD";
const { totp } = require("otplib");
totp.options = { digits: 6, step: 300 };

const register = async (req, res) => {
  const { name, email, password, securityQuestion, security } = req.body;
  //validation -> checking whether the user input datas are valid or not
  if (!name) {
    return res.json({
      error: "Name is required",
    });
  }

  //The await operator is used to wait for a Promise .
  if (!email) {
    return res.json({
      error: "Email id is required",
    });
  } else {
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "Email already exists",
      });
    }
  }

  if (!password || password.length < 8 || password.length > 32) {
    return res.json({
      error: "Password is required and it must contains 8 - 32 characters",
    });
  }

  if (
    !securityQuestion ||
    securityQuestion === "Please select a select question."
  ) {
    return res.json({
      error: "Security Question is required",
    });
  }

  if (!security) {
    return res.json({
      error: "Security answer is required",
    });
  }

  const hashedPassword = await hashPassword(password);

  const user = new User({
    name: name,
    email: email,
    password: hashedPassword,
    securityQuestion: securityQuestion,
    security: security,
  });

  try {
    await user.save();
    return res.json({
      ok: true,
    });
  } catch (err) {
    console.log("Registration failed", err);
    return res.status(400).send(err.response.data);
  }
};

const login = async (req, res) => {
  // console.log(req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // console.log(user);

    if (!user) {
      return res.json({
        error: "Invalid Email Address",
      });
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return res.json({
        error: "Invalid User Password",
      });
    }

    //creating a jwt token for valid user and send it to client for easy and safe communication between client and server
    const jwtToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_CODE, {
      expiresIn: "5d",
    });

    user.password = undefined;
    user.security = undefined;

    return res.json({
      user,
      jwtToken,
    });
  } catch (err) {
    return res.status(400).send("Login Failed!!");
  }
};

const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        ok: true,
      });
    }
  } catch (err) {
    res.sendStatus(400);
  }
};

const changePassword = async (req, res) => {
  const { email, newPassword, newPasswordAgain, securityQuestion, security } =
    req.body;

  if (!email) {
    return res.json({
      error: "Email Id is required",
    });
  }

  if (!newPassword || newPassword.length < 8 || newPassword.length > 32) {
    return res.json({
      error: "New Password is required and it must be between 8-32 characters",
    });
  }

  if (newPassword !== newPasswordAgain) {
    return res.json({
      error: "New Password and New Password Again are not same",
    });
  }

  if (
    !securityQuestion ||
    securityQuestion === "Please select a security question."
  ) {
    return res.json({
      error: "Security Question is required",
    });
  }

  if (!security) {
    return res.json({
      error: "Security Question's Answer is required",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "Invalid Email Address",
      });
    }

    if (user.securityQuestion !== securityQuestion) {
      return res.json({
        error: "Invalid Security Question",
      });
    }

    if (user.security !== security) {
      return res.json({
        error: "Invalid Security Question's Answer",
      });
    }

    const hashedPassword = await hashPassword(newPassword);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    return res.json({
      ok: true,
    });
  } catch (err) {
    console.log(err);
    return res.json({
      error: "Something wrong happened!! Try Again..",
    });
  }
};

const sendEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.json({
      error: "Email Id is not registered",
    });
  }

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "agrawalladarshan@gmail.com",
      pass: "nodemailer@darshan_2792$",
    },
  });

  //generate a random token of 6 digits
  const code = totp.generate(secret);

  var mailOptions = {
    from: "agrawalladarshan@gmail.com",
    to: `${email}`,
    subject: `Hello ${user.name}!! Verification Code`,
    text: `${code}`,
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      return res.json({
        error: "Something wrong happened.. try again!!",
      });
    } else {
      return res.json({
        code: code,
      });
    }
  });
};

const verifyCode = async (req, res) => {
  const {
    email,
    newPassword,
    newPasswordAgain,
    securityQuestion,
    security,
    verificationCode,
  } = req.body;

  try {
    const isValid = totp.check(verificationCode, secret);
    if (!isValid) {
      return res.json({
        error: "Verification Failed..",
      });
    }

    const user = await User.findOne({ email });
    if (!newPassword || newPassword.length < 8 || newPassword.length > 32) {
      return res.json({
        error:
          "New Password is required and it must be between 8-32 characters",
      });
    }

    if (newPassword !== newPasswordAgain) {
      return res.json({
        error: "New Password and New Password Again are not same",
      });
    }

    if (
      !securityQuestion ||
      securityQuestion === "Please select a security question."
    ) {
      return res.json({
        error: "Security Question is required",
      });
    }

    if (!security) {
      return res.json({
        error: "Security Question's Answer is required",
      });
    }

    const hashedPassword = await hashPassword(newPassword);
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      securityQuestion: securityQuestion,
      security: security,
    });

    return res.json({
      ok: true,
    });
  } catch (err) {
    return res.json({
      error: err,
    });
  }
};

module.exports = [
  register,
  login,
  getUserData,
  changePassword,
  sendEmail,
  verifyCode,
];
