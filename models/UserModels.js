const mongoose = require("mongoose");
const studentProfile = require("./studentProfile");
const userSchema = mongoose.Schema({
  fristname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  is_admin: {
    type: Number,
    default: 0,
    required: true,
  },
  is_verified: {
    type: Number,
    default: 0,
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "studentProfile",
  },
  regcampus:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campus",
  }]
});

module.exports = mongoose.model("User", userSchema);
