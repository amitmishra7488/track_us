const UserModel = require("../models/user.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    // const isEmail = await UserModel.findOne({ email: email });
    // if (isEmail) {
    //   return res.status(500).json({ message: "Email already registered" });
    // }
    const userExists = await UserModel.findOne({
      $or: [
        { email: email },
        { phoneNumber: phoneNumber }
      ]
    });

    if (userExists) {
      return res.status(500).json({ message: "Email or phone number already registered" });
    }

    console.log(req.body)
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      password: hashedPassword,
    });
    await newUser.save();
    console.log(newUser);
    res
      .status(201)
      .json({user:{ name: name, email: email, phoneNumber: phoneNumber }});
  } catch (error) {
    console.log(error)
    res.status(500).send("Error: " + error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;
    const user = await UserModel.findOne({
      $or: [{ email: email }, { phoneNumber: phoneNumber }],
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const expiresIn = "1h";
    const token = await jwt.sign({ id: user._id }, process.env.MYSECRETKEY, {
      expiresIn,
    });
    res
      .status(200)
      .json({ message: "Login successful", user: user, token: token });
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await UserModel.find();
    if(!user){
      return res.status(404).send("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
}

module.exports = { register, login, getUser };
