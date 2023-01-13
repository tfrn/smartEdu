const nodemailer = require("nodemailer");
const Course = require("../models/Course");
const User = require("../models/User");

exports.getIndex = async (req, res) => {
  try {
  const totalCourse = await Course.find().countDocuments();
  const totalStudent = await User.countDocuments({role:'student'});
  const totalTeacher = await User.countDocuments({role:'teacher'});
  res.status(200).render('index', {
    page_name: 'index',
    totalCourse,
    totalStudent,
    totalTeacher
  });
} catch (error) {
  res.status(400).render('course', {
    error,
  });
}
};

exports.getAbout = (req, res) => {
  res.status(200).render('about', {
    page_name: 'about', // navigasyondaki aktif sayfa için
  });
};

exports.getRegister = (req, res) => {
  res.status(200).render('register', {
    page_name: 'register', 
  });
};
exports.getLogin = (req, res) => {
  res.status(200).render('login', {
    page_name: 'login', 
  });
};

exports.getContact = (req, res) => {
  res.status(200).render('contact', {
    page_name: 'contact', 
  });
};

exports.sendMessage = async (req, res) => {
  try{
  const outputMessage = `
  <h1>Mail details</h1>
  <ul>
  <li>Name: ${req.body.name}<li>
  <li>Email: ${req.body.email}<li>
  </ul>
  <h1>Message</h1>
  <p>${req.body.comments}</p>
  `
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "nrfttfrn@gmail.com", // gmail account
      pass: "iwqacryzzpzbjzmz", // gmail password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"smartEdu contact form" <nrfttfrn@gmail.com>', // sender address
    to: "tfrn@live.fr", // list of receivers
    subject: "smartEdu contact New Message ✔", // Subject line
    html: outputMessage, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  
  req.flash("success", "We Received your message succesfully");
  res.status(200).redirect("contact");
  
}catch(err){
  req.flash("error", `Something happened!`);
  res.status(400).redirect("contact");
};
};