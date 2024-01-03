const mongoose = require('mongoose');

const additionalDetailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dob: {
    type: Date,
    default: null,
  },
  hobby: {
    type: String,
    default: '',
  },
  salary:{
    type: Number,
    default: null,
  },
  profilePicture: {
    data: Buffer,
    contentType: String,
  },
});

const AdditionalDetailsModel = mongoose.model('AdditionalDetails', additionalDetailsSchema);

module.exports = AdditionalDetailsModel;