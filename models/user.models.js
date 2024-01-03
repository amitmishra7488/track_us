const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
   name: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z]+([' -.]?[a-zA-Z]+)*$/.test(v);
      },
      message: "Please enter a valid name",
    },
    minlength: [3, 'Name should be at least 3 characters'],
    maxlength: [50, 'Name should not exceed 50 characters'],
    required: [true, "Name required"],
  },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email",
      },
      required: [true, "Email required"],
    },
    phoneNumber: {
      type: String,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[6789]\d{9}$/.test(v);
        },
        message: "Please enter a valid Indian phone number",
      },
      minlength: [10, 'Phone number should be exactly 10 digits'],
      maxlength: [10, 'Phone number should be exactly 10 digits'],
      required: [true, "Phone number required"],
    },
    password: {
      type: String,
      required: [true, "Password required"],
      minlength: [8, "Password should be at least 8 characters"],
      maxlength: [100, "Password should not exceed 100 characters"],
      validate: {
        validator: function (v) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v);
        },
        message: "Please enter a valid password",
      },
    },
    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdditionalDetails',
    },
  },
  {
    timestamps: true,
  }
);



const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
