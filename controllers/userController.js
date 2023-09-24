const User = require("../models/UserModels");
const Profile = require("../models/studentProfile");
const Campus = require("../models/campusModel")
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const userRoute = require("../routes/userRoute");
const async = require("hbs/lib/async");
// for hashing passwords
const securepassword = async (password) => {
  try {
    const passwordhash = await bcrypt.hash(password, 10);
    return passwordhash;
  } catch (error) {
    console.log(error.message);
  }
};
//verifaction mail method
const sendVerifyMail = async (name, email, user_id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: "587",
      secure: false,
      requireTLS: true,
      auth: {
        user: "kdeole94@gmail.com",
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: "kdeole94@gmail.com",
      to: email,
      subject: "Verify your mail",
      html:
        "<p>Hi " +
        name +
        ',please click here to verify your mail <a href="http://127.0.0.1:5000/user/verify?id=' +
        user_id +
        '">Verify </a></p>',
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Mail sent" + info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};
// To load Signup page

const loadSignup = async (req, res) => {
  try {
    res.render("signup");
  } catch (err) {
    console.log(err.message);
  }
};
// Database Entries
const signup = async (req, res) => {
  try {
    const spassword = await securepassword(req.body.password);
    const user = new User({
      fristname: req.body.fristname,
      lastname: req.body.lastname,
      email: req.body.email,
      mobile: req.body.mobile,
      password: spassword,
      image: req.file.filename,
      is_admin: 0,
    });
    const userData = await user.save();

    if (userData) {
      //To send verifaction mail
      sendVerifyMail(req.body.fristname, req.body.email, userData._id);

      res.render("Signup", {
        message:
          "Your registration has been completed, To login please verify your email",
      });
    } else {
      res.render("Signup", {
        message: "Your registration has been Failed",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const verifyMail = async (req, res) => {
  try {
    const updateInfo = await User.updateOne(
      { _id: req.query.id },
      { $set: { is_verified: 1 } }
    );
    console.log(updateInfo);
    res.render("mailverified");
  } catch (error) {
    console.log(error.message);
  }
};

// Login
const loadLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

// LoginVerifacation
const VerifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await User.findOne({ email: email });
    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        if (userData.is_verified === 0) {
          res.render("login", { message: "Please verify your Email" });
        } else {
          req.session.user_id = userData._id;
          res.redirect("/user/home");
        }
      } else {
        res.render("login", { message: "Email or Password is incorrect" });
      }
    } else {
      res.render("login", { message: "Email or Password is incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadHome = async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.session.user_id }).populate("profile");
    const campus = await Campus.find({}).populate("registeredStudents")
    res.render("userdashboard1", { user: userData,campus:campus});
  } catch (error) {
    console.log(error.message);
  }
};
//load profile
const loadProfile = async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.session.user_id });
    res.render("profile1", { user: userData });
  } catch (err) {
    console.log(err.message);
  }
};

//load Dashboard
// const loadDashboard = async (req, res) => {
//   try {
//     const id = req.query.id;
//     const userData = await User.findById({ _id: id });
//     if (userData) {
//       res.render("userdashboard", { user: userData });
//     } else {
//       res.redirect("/user/home");
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// };

//createprofile
const profile = async (req, res) => {
  try {
    const profile = new Profile({
      firstname: req.body.firstname,
      middlename: req.body.middlename,
      lastname: req.body.lastname,
      dob: req.body.date_of_birth,
      branch: req.body.Branch,
      mobile: req.body.mobile_number,
      per_add: req.body.per,
      email: req.body.email,
      nationality: req.body.nationality,
      cast: req.body.cast,
      total_percentage: req.body.tolper,
      tenth_percetage: req.body.tenth_percentage,
      school_passing_year: req.body.school_passing_year,
      School_collge_name: req.body.school_collage_name,
      tweth_percentage: req.body.tenth_percentage,
      tweth_passing_year: req.body.tweth_passing_year,
      tweth_college_name: req.body.tweth_collage_name,
      diploma_percentage: req.body.diploma_percentage,
      diploma_passing_year: req.body.diploma_passing_year,
      diploma_college_name: req.body.diploma_collage_name,
      diploma_branch: req.body.diploma_branch,
      first_sem: req.body.first_sem,
      secound_sem: req.body.second_sem,
      third_sem: req.body.third_sem,
      forth_sem: req.body.forth_sem,
      fifth_sem: req.body.fifth_sem,
      sixth_sem: req.body.sixth_sem,
      seventh_sem: req.body.seventh_sem,
      eight_sem: req.body.eight_sem,
      total_percentage: req.body.average_percentage,
      achive_particpant: req.body.achive_particpant,
      info: req.body.info,
    });

    const profiledata = await profile.save();

    if (profiledata) {
      res.redirect("/user/home");
      const id = req.body.id;
      await User.findByIdAndUpdate(
        { _id: id },
        { $set: { profile: profiledata._id } }
      );
      console.log("profile saved");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const profileedit = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("profile");
    console.log("proid" + user.profile._id);
    if (user) {
      res.render("editprofile1", { user });
    } else {
      res.redirect("/user/home");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const editprofile = async (req, res) => {
  try {
    const id = req.body.id;
    console.log("id" + id);
    const update = await Profile.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          firstname: req.body.firstname,
          middlename: req.body.middlename,
          lastname: req.body.lastname,
          dob: req.body.date_of_birth,
          branch: req.body.Branch,
          mobile: req.body.mobile_number,
          per_add: req.body.per,
          email: req.body.email,
          nationality: req.body.nationality,
          cast: req.body.cast,
          total_percentage: req.body.tolper,
          tenth_percetage: req.body.tenth_percentage,
          school_passing_year: req.body.school_passing_year,
          School_collge_name: req.body.school_collage_name,
          tweth_percentage: req.body.tenth_percentage,
          tweth_passing_year: req.body.tweth_passing_year,
          tweth_college_name: req.body.tweth_collage_name,
          diploma_percentage: req.body.diploma_percentage,
          diploma_passing_year: req.body.diploma_passing_year,
          diploma_college_name: req.body.diploma_collage_name,
          diploma_branch: req.body.diploma_branch,
          first_sem: req.body.first_sem,
          secound_sem: req.body.second_sem,
          third_sem: req.body.third_sem,
          forth_sem: req.body.forth_sem,
          fifth_sem: req.body.fifth_sem,
          sixth_sem: req.body.sixth_sem,
          seventh_sem: req.body.seventh_sem,
          eight_sem: req.body.eight_sem,
          total_percentage: req.body.average_percentage,
          achive_particpant: req.body.achive_particpant,
          info: req.body.info,
        },
      }
    );

    res.redirect("/user/home");
    console.log(update);
  } catch (error) {
    console.log(error.message);
  }
};
const registercampus = async(req,res)=>{
  try {
    
    const campusid=req.params.id
    const userid=req.session.user_id
    const update = await Campus.findByIdAndUpdate({_id:campusid},{$addToSet:{
      registeredStudents:userid
    }})
    console.log("campus updated",update)
    if(update){
      const user=await User.findByIdAndUpdate({_id:userid},{$addToSet:{
        regcampus:campusid
      }})
      console.log("campus id added",user)
    }
    res.redirect("/user/home")
  } catch (error) {
    
  }
  

}
//logout
const userLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/user/login");
  } catch (error) {}
};

const loadsetting = async (req,res)=>{
  try{
  const user = await User.findOne({_id:req.params.id})
  if(user){
    res.render("setting",{user})
  }
}
catch(error){
  console.log(error.message)
}
}
const updateuserinfo = async (req,res)=>{
  try {
    const userdata = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          fristname: req.body.name,
          lastname: req.body.lname,
          email: req.body.email,
          mobile:req.body.mno
        }
    });
    res.redirect("/user/home")
    console.log(userdata)
    }
   
    catch(error){
      console.log(error.message)
    }
}

const loadchangepass = async(req,res)=>{
  try {
    const id = req.params.id
    const user = await User.findById({_id:id})
    if(user){
      res.render("userchangepassword",{user})
    }
      
  } catch (error) {
    console.log(error.message)
  }
}

const changepass = async(req,res)=>{
  try {
    const id = req.params.id
    const user = await User.findById({_id:id})
    oldpass = req.body.currentPassword
    newpass = req.body.reenterNewPassword
    const passMatch = await bcrypt.compare(oldpass, user.password);
    if(passMatch){
      const spassword = await securepassword(newpass);
      const password = await User.findByIdAndUpdate({_id:id},
        {$set:{
          password:spassword
       }})
       console.log("Password Changed")
       res.render("userchangepassword",{user:user,message:"Password Change Sucessfully"})
    }
    else{
      res.render("userchangepassword",{user:user,message:"Incorrect Current Password"})
    }
  } catch (error) {
    console.log(error.message)
  }
}

const showregistercampus = async (req,res)=>{
  try {
    const id = req.session.user_id
  const user = await User.findById({_id:id}).populate("regcampus")
    if(user){
      res.render("regcampus",{user})
    }
  } catch (error) {
    console.log(error.message)
  }
}

const showCampusDetail = async (req, res) => {
  try {
    const id = await req.params.id;
    const campusdetails = await Campus.findById({ _id: id });
    if (campusdetails) {
      res.render("campusdetail", {campusdetails:campusdetails});
    } else {
      res.redirect("/user/home");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const unregcampus = async (req,res)=>{
  try {

    const userId=req.params.userid
    console.log("userid",userId)
    const campusId=req.params.campusid
    console.log("cam",campusId)
    const unr = await User.findByIdAndUpdate({_id:userId}, { $pull: { regcampus: campusId } })
    console.log("Campus Unregister",unr)
    res.redirect("/user/showregcampus")

  } catch (error) {
    
  }
}
// Modules exported
module.exports = {
  loadSignup,
  signup,
  verifyMail,
  loadLogin,
  VerifyLogin,
  loadHome,
  userLogout,
  loadProfile,
  profile,
  profileedit,
  editprofile,
  registercampus,
  loadsetting,
  updateuserinfo,
  loadchangepass,
  changepass,
  showregistercampus,
  showCampusDetail,
  unregcampus
};
