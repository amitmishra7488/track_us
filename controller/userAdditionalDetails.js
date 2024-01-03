const AdditionalDetailsModel = require("../models/additionalDetails.models");
const UserModel = require("../models/user.models");

const additionalDetails = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { dob, hobby, salary } = req.body;

    // user details object
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch existing additional details
    let additionalDetails = await AdditionalDetailsModel.findOne({
      userId: user._id,
    });

    // If no existing additional details, create a new instance
    if (!additionalDetails) {
      additionalDetails = new AdditionalDetailsModel({
        userId: user._id,
      });
    }

    // Update only the fields present in the request
    if (dob) additionalDetails.dob = dob;
    if (hobby) additionalDetails.hobby = hobby;
    if (salary) additionalDetails.salary = salary;

    // Save or update additional details
    await additionalDetails.save();

    // Link additional details to the user
    user.additionalDetails = additionalDetails._id;
    await user.save();

    // Populate user object with additional details
    const populatedUser = await UserModel.findById(userId).populate(
      "additionalDetails"
    );

    res
      .status(201)
      .json({
        message: "Additional details added successfully",
        user: populatedUser,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { additionalDetails };
