const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const Category = require('../models/Category');
const Course = require('../models/Course');

// register için
// create new User
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).redirect('/login');
  } catch (error) {
    const errors = validationResult(req);
    for (let i = 0; i < errors.array().length; i++) {
      req.flash('error', `${errors.array()[i].msg}`);
    }
    res.status(400).redirect('/register');
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, same) => {
        // USER SESSION
        if (same) {
          req.session.userID = user._id;
          res.status(200).redirect('/users/dashboard');
        } else {
          req.flash('error', 'Your password is not correct!');
          res.status(400).redirect('/login');
        }
      });
    } else {
      req.flash('error', 'User is not exist!');
      res.status(400).redirect('/login');
    }
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

// logout User

exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

// delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndRemove({ _id: req.params.id });
    const course = await Course.deleteMany({ user: req.params.id }); // course.user değeri paramstan gelen değere eşit olanların hepsini siler. findOneAndRemove ile yazsaydık sadece ilkini siler diğerlerini bırakırdı.  
    req.flash('error', `User has been removed successfully`);
    res.status(200).redirect('/users/adminpanel');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

// Dashboard

exports.getDashboard = async (req, res) => {
  const user = await User.findOne({ _id: req.session.userID }).populate(
    'courses'
  );
  const categories = await Category.find();
  const courses = await Course.find({ user: req.session.userID });
  res.status(200).render('dashboard', {
    page_name: 'dashboard',
    user,
    categories,
    courses,
  });
};

// adminPanel

exports.getAdminPanel = async (req, res) => {
  const user = await User.findOne({ _id: req.session.userID }).populate('courses');
  const users = await User.find();
  const categories = await Category.find();
  const allcourses = await Course.find().populate(['user', 'category']);
  const courses = await Course.find({ user: req.session.userID });
  res.status(200).render('adminpanel', {
    page_name: 'adminpanel',
    user,
    categories,
    courses,
    users,
    allcourses
  });
};

// admin panel create new course
exports.createCourse2 = async (req, res) => {
  try {
    const course = await Course.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      user: req.body.user,
    });
    req.flash('success', 'Course create succesfully!');
    res.status(201).redirect('/users/adminpanel');
  } catch (error) {
    req.flash('error', 'Something happen!');
    res.status(400).redirect('/users/adminpanel');
  }
};