const UserModel = require("../models/user.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../lib/mailer");
const TempUserModel = require("../models/tempUser.model");
const { generateOtp } = require("../lib/generateOtp");


const generateOTP = async (req, res) => {
  try {
    const { email, name } = req.body;
    console.log(name,email);
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const tempExistingUser = await TempUserModel.findOne({ email });
    if (tempExistingUser) {
      const currentTime = new Date();
      const resendWindow = 15 * 60 * 1000;

      if (currentTime - tempExistingUser.createdAt < resendWindow) {
        const timeRemaining = Math.ceil((tempExistingUser.createdAt.getTime() + resendWindow - currentTime.getTime()) / (60 * 1000));

        return res.status(201).json({
          message: 'OTP Already Sent. Please enter the last OTP. It will expire in ' + timeRemaining + ' minutes.',
        });
      }
    }
    

    // Send the OTP via email
    const otp = generateOtp();
    console.log(otp);

    const emailResponse = await sendEmail(email,name, `Your OTP is: ${otp}`);
    console.log('Email Response:', emailResponse);
    const tempUser = new TempUserModel({ name, email, otp });
    await tempUser.save();

    res.status(200).json({ message: 'OTP generated and sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


const register = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, otp } = req.body;
    const tempUser = await TempUserModel.findOne({ email, otp });
    if (!tempUser) {
      return res.status(500).json({ message: "Invalid OTP" });
    }
    const userExists = await UserModel.findOne({
      $or: [
        { email: email },
        { phoneNumber: phoneNumber }
      ]
    });
    if (userExists) {
      return res.status(500).json({ message: "Email or phone number already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      password: hashedPassword,
    });
    await newUser.save();
    await TempUserModel.findOneAndDelete({ email });
    res.status(201).json({
      user: { name: name, email: email, phoneNumber: phoneNumber },
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error: " + error.message });
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

module.exports = { register, login, getUser, generateOTP };
