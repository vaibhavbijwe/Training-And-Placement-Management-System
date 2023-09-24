const express = require("express");
const admin_route = express();

const session = require("express-session");
admin_route.use(session({ secret: process.env.sessionkey }));

const auth = require("../middleware/adminAuth");

admin_route.set("view engine", "ejs");
admin_route.set("views", "./views/admin");

const bodyParser = require("body-parser");
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({ extended: true }));

const multer = require("multer");
const path = require("path");

admin_route.use(express.static("public"));

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

const adminController = require("../controllers/adminController");

admin_route.get("/", auth.isLogout, adminController.loadAdmin);

admin_route.post("/", adminController.verifyLogin);

admin_route.get("/home", auth.isLogin,adminController.loadDashboard);

admin_route.get("/logout", auth.isLogin, adminController.logout);

admin_route.get("/addstudent", auth.isLogin, adminController.loadaddStudent);

admin_route.post(
  "/addstudent",
  auth.isLogin,
  upload.single("image"),
  adminController.addStudent
);

admin_route.get("/showstudent", auth.isLogin, adminController.showStudent);

admin_route.get("/userprofile/:id", auth.isLogin, adminController.showProfile);

admin_route.get("/users", auth.isLogin, adminController.showUsers);

admin_route.get("/deleteuser/:id", auth.isLogin, adminController.deleteUsers);

admin_route.get( "/editprofile/:id",auth.isLogin,adminController.loadeditProfile);

admin_route.post("/editprofile/:id", auth.isLogin, adminController.editProfile);

admin_route.get("/deleteprofile/:id",auth.isLogin,adminController.deleteprofile);

admin_route.get("/setting",auth.isLogin,adminController.loadsetting)

admin_route.post("/setting/:id",auth.isLogin,adminController.updateadmininfo)

admin_route.get("/changepass",auth.isLogin,adminController.loadchangepass)

admin_route.post("/changepass/:id",auth.isLogin,adminController.changepass)

admin_route.get("/newcampus", auth.isLogin, adminController.loadaddNewcampus);

admin_route.post("/newcampus", auth.isLogin,adminController.addCampus);

admin_route.get("/showcampus", auth.isLogin, adminController.showCampus);

admin_route.get("/showcampusdetail/:id", auth.isLogin, adminController.showCampusDetail);

admin_route.get("/editcampus/:id",auth.isLogin,adminController.loadeditcampus);

admin_route.post("/editcampus/:id",auth.isLogin,adminController.editCampusDetail);

admin_route.get("/deletecampus/:id",auth.isLogin,adminController.deleteCampus);

admin_route.get("/showregstudent/:id",auth.isLogin,adminController.showregstudents)

admin_route.get("*", (req, res) => {
  res.redirect("/admin");
});
module.exports = admin_route;
