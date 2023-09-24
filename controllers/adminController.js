const User = require("../models/UserModels");
const Profile = require("../models/studentProfile");
const Campus = require("../models/campusModel");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const async = require("hbs/lib/async");

const loadAdmin = async (req, res) => {
  try {
    res.render("adminlogin");
  } catch (error) {
    console.log(error.message);
  }
};
//verifaction mail method
const addstudentMail = async (name, email, password, user_id) => {
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
        '">Verify </a><br><br> Email:' +
        email +
        "<br> password:" +
        password +
        "</p>",
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
//Campus Added mail
const campusAdded = async (company_name,job_title,job_dec,job_ctc,job_loc) => {
  try {

    const users = await User.find({is_admin:0})
    const emails = users.map(user =>user.email)
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
      to: emails.join(","),
      subject: "New campus Drive for " + company_name,
      html: `<p>Dear Student,</p>

<p>I hope this email finds you in good health and high spirits. I am writing this email to inform you that we have added a new campus to our list of campuses, and I am excited to share some job opportunities available at this new campus.</p>
<strong>${company_name}</strong> has recently opened a new campus drive in our collage, and they are looking for talented and motivated individuals to join their team. They have job openings available, for <strong>${job_title}</strong>.<p>The job descriptions for each position are provided below:</p>
Job Title:<b>${job_title}</b><br>
<b>Job Description:</b>${job_dec}
CTC:<b>${job_ctc}</b><br>
Location: ${job_loc}
<p>
If you are interested in any of these job opportunities, please do not hesitate to apply. To apply, please log in to your TNP portal and apply for the job positions by [Job Application Deadline].</p>
<p>I wish you the best of luck in your job search, and I hope that this email has been helpful. Please let me know if you have any questions or if there is anything else that I can assist you with.</p>`,
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

const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email });
    if (userData) {
      const passMatch = await bcrypt.compare(password, userData.password);

      if (passMatch) {
        if (userData.is_admin == 0) {
          res.render("adminlogin", {
            message: "You are not allowed to login",
          });
        } else {
          req.session.user_id = userData._id;
          res.redirect("/admin/home");
        }
      } else {
        res.render("adminlogin", {
          message: "Email and Passwors is incorrect",
        });
      }
    } else {
      res.render("adminlogin", { message: "Email and Passwors is incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
};
const securepassword = async (password) => {
  try {
    const passwordhash = await bcrypt.hash(password, 10);
    return passwordhash;
  } catch (error) {
    console.log(error.message);
  }
};
const loadDashboard = async (req, res) => {
  try { 
   const campus = await Campus.find({}) 
    const userData = await User.findById({ _id: req.session.user_id });
    res.render("newadmindash", { user: userData, campus:campus});
  } catch (error) {
    console.log(error.message);
  }
};

const loadaddStudent = async (req, res) => {
  try {
    res.render("addstudent");
  } catch (error) {
    console.log(error.message);
  }
};

const addStudent = async (req, res) => {
  try {
    const fristname = req.body.fristname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const password = randomstring.generate(10);
    const image = req.file.filename;
    const spassword = await securepassword(password);

    const user = new User({
      fristname: fristname,
      lastname: lastname,
      email: email,
      mobile: mobile,
      image: image,
      password: spassword,
      is_admin: 0,
    });
    const userData = await user.save();
    if (userData) {
      addstudentMail(fristname, email, password, userData._id);
      res.redirect("/admin/home");
      console.log("UserAdded ");
    } else {
      res.render("addstudent", { message: "Error, Something went wrong" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const showStudent = async (req, res) => {
  try {
    const userData = await User.find({ is_admin: 0 });
    const profile = await Profile.find({});
    res.render("showstudent", { users: userData, profile: profile });
  } catch (error) {
    console.log(error.message);
  }
};

const showUsers = async (req, res) => {
  try {
    const userData = await User.find({ is_admin: 0 });
    res.render("showuser", { users: userData });
  } catch (error) {
    console.log(error.message);
  }
};

const deleteUsers = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const userdata = await User.findById({ _id: id });
    if (userdata.profile && userdata.profile._id) {
      const profileid = userdata.profile._id;
      Profile.findByIdAndDelete(profileid).then(() => {
        console.log("Profile Deleted");
        console.log(id);
        User.findByIdAndDelete(id).then(() => {
          console.log("User Deleted");
          res.redirect("/admin/users");
        });
      });
    } else {
      User.findByIdAndDelete(id).then(() => {
        console.log("User Deleted");
        res.redirect("/admin/users");
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const showProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    console.log("proid" + profile._id);
    if (profile) {
      res.render("showprofile", { profile });
    } else {
      res.redirect("/admin/student");
    }
  } catch (error) {
    console.log(error.message);
  }
};
const loadeditProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (profile) {
      res.render("editprofile1", { profile });
    } else {
      res.redirect("/admin/showstudent");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const editProfile = async (req, res) => {
  try {
    const profile = await Profile.findByIdAndUpdate(
      { _id: req.params.id },
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
    console.log(profile);
    res.redirect("/admin/showstudent");
  } catch (error) {
    console.log(error.message);
  }
};

const loadsetting = async (req,res)=>{
  try{
  const user = await User.findOne({is_admin:1})
  if(user){
    res.render("setting",{user})
  }
}
catch(error){
  console.log(error.message)
}
}
const updateadmininfo = async (req,res)=>{
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
    res.redirect("/admin/home")
    console.log(userdata)
    }
   
    catch(error){
      console.log(error.message)
    }
}

const loadchangepass = async(req,res)=>{
  try {const user = await User.findOne({is_admin:1})
    if(user){
      res.render("changepassword",{user})
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
       res.render("changepassword",{user:user,message:"Password Change Sucessfully"})
    }
    else{
      res.render("changepassword",{user:user,message:"Incorrect Current Password"})
    }
  } catch (error) {
    console.log(error.message)
  }
}

const deleteprofile = async (req, res) => {
  try {
    const id = req.params.id;
    await Profile.deleteOne({ _id: id });
    res.redirect("/admin/showstudent");
    console.log("Profile Deleted Sucessfully");
  } catch (error) {
    console.log(error.message);
  }
};

const loadaddNewcampus = async (req, res) => {
  try {
    res.render("addcampus");
  } catch (error) {
    console.log(error.message);
  }
};

const addCampus = async (req, res) => {
  try {
    Company_Name = req.body.company_name;
    Job_Title = req.body.job_title;
    Job_location = req.body.job_loc;
    Batch = req.body.batch;
    Ctc = req.body.job_ctc;
    Job_description = req.body.job_dec;

    const campus = new Campus({
      company: Company_Name,
      jobTitle: Job_Title,
      joblocation: Job_location,
      description: Job_description,
      batch: Batch,
      ctc: Ctc,
    });
    const campusdata = await campus.save();
    if(campusdata){
      campusAdded(Company_Name,Job_Title,Job_description,Ctc,Job_location);
      console.log("Campus Added", campusdata);
      res.redirect("/admin/showcampus");
    }
    
  } catch (error) {
    console.log(error.message);
  }
};
const showCampus = async (req, res) => {
  try {
    const campus = await Campus.find({});

    if (campus) {
      res.render("showcampus", { campus });
    } else {
      res.redirect("/admin/home");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const showCampusDetail = async (req, res) => {
  try {
    const id = await req.params.id;
    const campusdetails = await Campus.findById({ _id: id });
    if (campusdetails) {
      res.render("campusdetail", { campusdetails });
    } else {
      res.redirect("/admin/showcampus");
    }
  } catch (error) {
    console.log(error.message);
  }
};
const loadeditcampus = async (req, res) => {
  try {
    const id = await req.params.id;
    const campusdetails = await Campus.findById({ _id: id });
    if (campusdetails) {
      res.render("editcampus", { campusdetails });
    } else {
      res.redirect("/admin/showcampus");
    }
  } catch (error) {
    console.log(error.message);
  }
};
const editCampusDetail = async (req, res) => {
  try {
    const id = req.params.id;
    const campusinfo = await Campus.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          company: req.body.company_name,
          jobTitle: req.body.job_title,
          joblocation: req.body.job_loc,
          description: req.body.job_dec,
          batch: req.body.batch,
          ctc: req.body.job_ctc,
        },
      }
    );
    console.log(campusinfo);
    res.redirect("/admin/showcampus");
  } catch (error) {
    console.log(error.message);
  }
};

const deleteCampus = async (req, res) => {
  try {
    const id = req.params.id;
    await Campus.deleteOne({ _id: id });
    console.log("Campus Deleted");
    res.redirect("/admin/showcampus");
  } catch (error) {
    console.log(error.message);
  }
};
const logout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
  }

};

const showregstudents = async (req,res) =>{
  try {
    const id= req.params.id
    const campus = await Campus.findById({_id:id}).populate("registeredStudents")
    if(campus){
      res.render("registeredstudents",{campus})
    }
  } catch (error) {
    console.log(error.message)
  }
}
module.exports = {
  loadAdmin,
  verifyLogin,
  loadDashboard,
  loadaddStudent,
  addStudent,
  showStudent,
  showProfile,
  showUsers,
  deleteUsers,
  loadeditProfile,
  editProfile,
  loadsetting,
  deleteprofile,
  loadaddNewcampus,
  addCampus,
  showCampus,
  showCampusDetail,
  loadeditcampus,
  editCampusDetail,
  deleteCampus,
  updateadmininfo,
  loadchangepass,
  changepass,
  showregstudents,
  logout,
};
