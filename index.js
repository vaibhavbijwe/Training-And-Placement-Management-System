const express = require("express");
const app = express();
const connectDB = require("./db/connect");
require("dotenv").config();
const userRoute = require("./routes/userRoute");
const homeRoute = require("./routes/homeRoute");
const adminRoute = require("./routes/adminRoute");
//Routrss
app.use(express.static(__dirname + "/public"));
app.use("/", homeRoute);
app.use("/user", userRoute);
app.use("/admin", adminRoute);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(5000, () => {
      console.log("listening on port 5000...");
      console.log("http://localhost:5000");
    });
  } catch (error) {
    console.log(error);
  }
};
start();
