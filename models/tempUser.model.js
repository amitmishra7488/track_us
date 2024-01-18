const mongoose = require('mongoose');

const tempUserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now, expires: 900 }
});

const TempUserModel = mongoose.model('TempUser', tempUserSchema);

module.exports = TempUserModel;
