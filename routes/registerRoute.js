const express = require('express');
const authController = require('../controllers/authController');
const authMiddleWare = require('../middlewares/authMiddleWare');
const { body } = require('express-validator');
const router = express.Router();
const User = require('../models/User');

router.route('/signup').post(
  [
    body('name').not().isEmpty().withMessage('Please Enter Your Name'), // register'daki name alanı boşsa dönecek mesaj.
    body('email')
      .isEmail()
      .withMessage('Please Enter Valid Email') // register'daki email alanı boşsa dönecek mesaj.
      .custom((userEmail) => {
        return User.findOne({ email: userEmail }).then((user) => {
          // register'da girilen email ile kayıtlı emailleri kontrol etme.
          if (user) {
            return Promise.reject('Email is already exists!'); // register'daki email alanı boş değilse ama kayıtlı bir eposta adresi girilmişse dönecek mesaj.
          }
        });
      }),

    body('password').not().isEmpty().withMessage('Please Enter A Password'), // password alanı boşsa dönecek mesaj.
  ],
  authController.createUser
); // http://localhost:3000/users/signup
router.route('/login').post(authController.loginUser); // http://localhost:3000/users/signup
router.route('/logout').get(authController.logoutUser); // http://localhost:3000/users/logout
router.route('/dashboard').get(authMiddleWare, authController.getDashboard); // http://localhost:3000/users/dashboard // dashboarda bir istek geldiğinde önce authMiddleWare'i kontrol et, true dönüyorsa devam et demiş oluyoruz.
router.route('/adminpanel').get(authMiddleWare, authController.getAdminPanel); // http://localhost:3000/users/dashboard // dashboarda bir istek geldiğinde önce authMiddleWare'i kontrol et, true dönüyorsa devam et demiş oluyoruz.
router.route('/:id').delete(authController.deleteUser);
router.route('/createCourse2').post(authController.createCourse2);
module.exports = router;
