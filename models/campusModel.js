const mongoose = require("mongoose");
const User = require("./UserModels");

const campusSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    jobTitle: { type: String, required: true },
    joblocation: { type: String, required: true },
    description: { type: String },
    batch: { type: Number, required: true },
    ctc: { type: String, required: true },
    registeredStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Campus", campusSchema);
