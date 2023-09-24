const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const studentProfileSchema = Schema({
  firstname: {
    type: String,
    require: true,
  },
  middlename: {
    type: String,
    require: true,
  },
  lastname: {
    type: String,
    require: true,
  },
  branch: {
    type: String,
    require: true,
  },
  dob: {
    type: String,
    require: true,
  },
  mobile: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  per_add: {
    type: String,
  },
  nationality: {
    type: String,
    require: true,
  },

  cast: {
    type: String,
    require: true,
  },

  //Class 10
  tenth_percetage: {
    type: String,

    require: true,
  },
  school_passing_year: {
    type: String,
    require: true,
  },
  School_collge_name: {
    type: String,
    require: true,
  },
  // class 12

  tweth_percentage: {
    type: Number,
  },
  tweth_passing_year: {
    type: String,
  },
  tweth_college_name: {
    type: String,
  },
  //Diploma
  diploma_percentage: {
    type: Number,
  },
  diploma_passing_year: {
    type: String,
    require: true,
  },
  diploma_college_name: {
    type: String,
    require: true,
  },
  diploma_branch: {
    type: String,
    require: true,
  },
  //Percentage of be sem wise
  first_sem: {
    type: Number,
  },
  secound_sem: {
    type: Number,
  },
  third_sem: {
    type: Number,
  },
  forth_sem: {
    type: Number,
  },
  fifth_sem: {
    type: Number,
  },
  sixth_sem: {
    type: Number,
  },
  seventh_sem: {
    type: Number,
  },
  eight_sem: {
    type: Number,
  },
  total_percentage: {
    type: Number,
  },
  //achivement / particpant
  achive_particpant: {
    type: String,
  },

  //Any other information to add
  info: {
    type: String,
  },
  
});

module.exports = mongoose.model("studentProfile", studentProfileSchema);
