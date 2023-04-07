const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// handle errors

const handleError = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "", message: err.message };

  // Incorrect Email
  if (err.message === "Incorrect Email") {
    errors.email = "This email is not registered";
  }

  // Incorrect Password
  if (err.message === "Incorrect Password") {
    errors.password = "Incorrect Password";
  }

  // duplicate error code
  if (err.code === 11000) {
    errors.email = "This email is already registered";
    return errors;
  }

  // validation errors
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "chadokar", {
    expiresIn: maxAge,
  });
};

// module.exports.signup_get = (req, res) => {
//   res.render("signup");
// };

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  const { email, password, lastname, firstname } = req.body;
  try {
    const user = await User.create({ email, password, lastname, firstname });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user, token });
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json(errors);
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user, token });
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  console.log("entered");
  res.cookie("jwt", "", { maxAge: 1 });
};

module.exports.update_user_put = async (req, res) => {
  console.log(req.body);
  const { firstname, lastname, email, discription } = req.body;
  const userid = req.params.userid;
  console.log(firstname, lastname, email, 88);
  try {
    const user = await User.findByIdAndUpdate(userid, {
      firstname,
      lastname,
      email,
      discription,
    });
    if (!user) {
      throw Error("User not found");
    }
    const userInfo = await User.findById(req.params.userid);
    res.status(200).json(userInfo);
  } catch (err) {
    res.status(400).json({ errors: err });
  }
};

module.exports.change_password = async (req, res) => {
  const { password } = req.body;
  const id = req.params.userid;
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    if (!hashedPassword) {
      throw Error("Password change failure");
    }
    const user = await User.findByIdAndUpdate(id, { password: hashedPassword });
    if (!user) {
      throw Error("User not found");
    }
    const userInfo = await User.findById(req.params.userid);
    res.status(200).json(userInfo);
  } catch (err) {
    res.status(400).json({ errors: err });
  }
};

module.exports.get_details = async (req, res) => {
  console.log(req.params);
  const id = req.params.userid;
  console.log(id);
  try {
    const user = await User.findById(id);
    res.status(201).json(user);
  } catch (err) {
    res.status(401).json(err);
  }
};

module.exports.uploadImage = async (req, res, next) => {
  const id = req.params.userid;
  const profileImage = req.body.file;
  try {
    const userInfo = await User.findByIdAndUpdate(id, {
      profileImage: profileImage,
    });
    await userInfo.save();
    const user = await User.findById(id);
    res.json({ message: "Image uploaded successfully", user });
  } catch (error) {
    res.status(500).json({ error });
  }
};
