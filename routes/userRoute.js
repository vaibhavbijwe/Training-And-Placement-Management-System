const express = require("express");
const user_route = express();

const session = require("express-session");
user_route.use(session({ secret: process.env.sessionkey }));

const auth = require("../middleware/auth");

user_route.set("view engine", "ejs");
user_route.set("views", "./views/student");

const bodyParser = require("body-parser");
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));

const multer = require("multer");
const path = require("path");

user_route.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/userimg"));
  },
  filename: function (req, file, cb) {
    const fname =
      req.body.fristname + "-" + req.body.lastname + "-" + file.originalname;
    cb(null, fname);
  },
});

const upload = multer({ storage: storage });

const userController = require("../controllers/userController");
user_route.get("/signup", auth.isLogout, userController.loadSignup);

user_route.post("/signup", upload.single("image"), userController.signup);

user_route.get("/verify", userController.verifyMail);

user_route.get("/login", auth.isLogout, userController.loadLogin);

user_route.post("/login", userController.VerifyLogin);

user_route.get("/home", auth.isLogin, userController.loadHome);

user_route.get("/profile", userController.loadProfile);
user_route.post("/profile", userController.profile);

user_route.get("/edit/:id", auth.isLogin, userController.profileedit);
user_route.post("/edit", userController.editprofile);

user_route.get("/registercampus/:id",auth.isLogin,userController.registercampus)

user_route.get("/setting/:id",auth.isLogin,userController.loadsetting)

user_route.post("/setting/:id",userController.updateuserinfo)

user_route.get("/changepass/:id",auth.isLogin,userController.loadchangepass)

user_route.post("/changepass/:id",auth.isLogin,userController.changepass)

user_route.get("/showregcampus",auth.isLogin,userController.showregistercampus)

user_route.get("/showcampusdetail/:id", auth.isLogin, userController.showCampusDetail);

user_route.get("/unregcampus/:userid/:campusid",auth.isLogin,userController.unregcampus)

user_route.get("/logout", auth.isLogin, userController.userLogout);

module.exports = user_route;
