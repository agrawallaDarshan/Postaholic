const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { name, email, password, security } = req.body;
  //validation -> checking whether the user input datas are valid or not
  if (!name) {
    return res.status(400).send("Name is required");
  }

  //The await operator is used to wait for a Promise .
  if (!email) {
    return res.status(400).send("Email ID is required");
  } else {
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).send("Email already exists");
    }
  }

  if (!password || password.length < 9 || password.length > 32) {
    return res
      .status(400)
      .send("Password is required and it must contains 8 - 32 characters");
  }

  if (!security) {
    return res.status(400).send("Security answer is required");
  }

  const hashedPassword = await hashPassword(password);

  const user = new User({
    name: name,
    email: email,
    password: hashedPassword,
    security: security,
  });

  try {
    await user.save();
    //console.log(`${user} => Saved Successfully`);
    return res.json({
      ok: true,
    });
  } catch (err) {
    //console.log("Registration failed", err);
    res.status(400).send("Registration failed");
  }
};

const login = async (req, res) => {
  // console.log(req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // console.log(user);

    if (!user) {
      return res.status(400).send("Invalid Email Address");
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return res.status(400).send("Invalid User Password");
    }

    //creating a jwt token for valid user and send it to client for easy and safe communication between client and server
    const jwtToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_CODE, {
      expiresIn: "7d",
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
    const user = User.findById(req.user._id);
    if (user) {
      console.log(`User = ${user}`);
      res.json({
        ok: true,
      });
    }
  } catch (err) {
    res.sendStatus(400);
  }
};

module.exports = [register, login, getUserData];
