const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const secret = "KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD";
const { totp } = require("otplib");
totp.options = { digits: 6, step: 300 };

const register = async (req, res) => {
  const { name, email, username, password, image, securityQuestion, security } =
    req.body;
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

  if (!username) {
    return res.json({
      error: "Username is required",
    });
  } else {
    const exist = await User.findOne({ username });
    if (exist) {
      return res.json({
        error: "Username already exists",
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
    username: username,
    password: hashedPassword,
    image: image,
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
    user.securityQuestion = undefined;
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

const updateUserProfile = async (req, res) => {
  try {
    const data = {};
    if (req.body.name) {
      data.name = req.body.name;
    }

    if (req.body.username) {
      const username = req.body.username;
      data.username = username;
      const user = await User.findById(req.user._id);
      if (user.username !== data.username) {
        const exist = await User.findOne({ username });
        if (exist) {
          return res.json({
            error: "Username already exists",
          });
        }
      }
    }

    if (req.body.about) {
      data.about = req.body.about;
    }

    if (req.body.image) {
      data.image = req.body.image;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, data, {
      new: true,
    });

    updatedUser.password = undefined;
    updatedUser.securityQuestion = undefined;
    updatedUser.security = undefined;

    return res.json({
      updatedUser,
    });
  } catch (err) {
    console.log(err);
    return res.json({
      error: "Something wrong happened",
    });
  }
};

const updateUserPassword = async (req, res) => {
  const { currentPassword, newPassword, securityQuestion, security } = req.body;
  if (
    !currentPassword &&
    (!securityQuestion ||
      securityQuestion === "Please select a security question." ||
      !security)
  ) {
    return res.json({
      error: "Please choose a security question and answer",
    });
  }

  if (
    (currentPassword && currentPassword.length < 8) ||
    currentPassword.length > 32
  ) {
    return res.json({
      error: "Password must be between 8-32 characters",
    });
  }

  if (!newPassword || newPassword.length < 8 || newPassword.length > 32) {
    return res.json({
      error: "New password must be between 8-32 characters",
    });
  }

  try {
    if (currentPassword) {
      const user = await User.findById(req.user._id);
      const isValid = await comparePassword(currentPassword, user.password);

      if (!isValid) {
        return res.json({
          error: "Invalid current password",
        });
      }
      const hashedNewPassword = await hashPassword(newPassword);
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
          password: hashedNewPassword,
        },
        { new: true }
      );

      updatedUser.password = undefined;
      updatedUser.securityQuestion = undefined;
      updatedUser.security = undefined;

      return res.json({
        ok: true,
      });
    } else {
      const user = await User.findById(req.user._id);

      if (securityQuestion !== user.securityQuestion) {
        return res.json({
          error: "Invalid security question",
        });
      }

      if (security !== user.security) {
        return res.json({
          error: "Invalid security answer",
        });
      }

      const hashedNewPassword = await hashPassword(newPassword);
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
          password: hashedNewPassword,
        },
        { new: true }
      );

      updatedUser.password = undefined;
      updatedUser.securityQuestion = undefined;
      updatedUser.security = undefined;

      return res.json({
        ok: true,
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      error: "Something wrong happened, try again..",
    });
  }
};

const findPeople = async (req, res) => {
  try {
    let num = 10;
    const user = await User.findById(req.user._id);
    let followers = user.following;
    followers.push(user._id);

    // nin refers to not include, it will find all the users which id does not match with followers(array of ids).
    //select -> it specifies the field and "-password or -fieldName" means it will select all the fields excluding those field
    const people = await User.find({ _id: { $nin: followers } })
      .select("-password -securityQuestion -security")
      .limit(num);

    res.json(people);
  } catch (err) {
    console.log(err);
    return res.json({
      error: "Something wrong happened, try again..",
    });
  }
};

//middleware
//$addToSet : => It is used to avoid the adding of duplicate elements in the database
const addFollower = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      $addToSet: {
        followers: req.user._id,
      },
    });

    next();
  } catch (err) {
    console.log(err);
    return res.json({
      error: "Something wrong happened..Please try again",
    });
  }
};

const addFollowing = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: {
          following: req.body._id,
        },
      },
      { new: true }
    ).select("-password -securityQuestion -security");

    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.json({
      error: "Something wrong happened..Please try again",
    });
  }
};

const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const following = await User.find({
      _id: user.following,
    })
      .limit(10)
      .select("-password -securityQuestion -security");

    res.json(following);
  } catch (err) {
    console.log(err);
    return res.json({
      error: "Something wrong happened..Please try again",
    });
  }
};

const removeFollower = async (req, res, next) => {
  try {
    //remove follower
    const user = await User.findByIdAndUpdate(
      req.body._id,
      {
        $pull: { followers: req.user._id },
      },
      { new: true }
    );

    next();
  } catch (err) {
    console.log(err);
    return res.json({
      error: "Something wrong happened..Please try again",
    });
  }
};

const removeFollowing = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.body._id },
      },
      {
        new: true,
      }
    ).select("-password -securityQuestion -security");

    res.json(user);
  } catch (err) {
    console.log(err);
    return res.json({
      error: "Something wrong happened..Please try again",
    });
  }
};

const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const followers = await User.find({
      _id: user.followers,
    })
      .select("-password -securityQuestion -security")
      .limit(10);

    res.json(followers);
  } catch (err) {
    console.log(err);
    return res.json({
      error: "Something wrong happened..Please try again",
    });
  }
};

const fRemoveFollowing = async (req, res, next) => {
  try {
    //remove follower
    const user = await User.findByIdAndUpdate(
      req.body._id,
      {
        $pull: { following: req.user._id },
      },
      { new: true }
    );

    next();
  } catch (err) {
    console.log(err);
    return res.json({
      error: "Something wrong happened..Please try again",
    });
  }
};

const fRemoveFollower = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { followers: req.body._id },
      },
      {
        new: true,
      }
    ).select("-password -securityQuestion -security");

    res.json(user);
  } catch (err) {
    console.log(err);
    return res.json({
      error: "Something wrong happened..Please try again",
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
  updateUserProfile,
  updateUserPassword,
  findPeople,
  addFollower,
  addFollowing,
  getFollowing,
  removeFollower,
  removeFollowing,
  getFollowers,
  fRemoveFollowing,
  fRemoveFollower,
];
