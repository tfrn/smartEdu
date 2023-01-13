const express = require('express');
const pageControllers = require('../controllers/pageControllers');
const redirectMiddleWare = require('../middlewares/redirectMiddleWare');

const router = express.Router();
router.route('/').get(pageControllers.getIndex);
router.route('/about').get(pageControllers.getAbout);
router.route('/register').get(redirectMiddleWare, pageControllers.getRegister); // giriş yapmış olduğumuz halde login ve register'a ulaşmaya çalışıyorsak, önce redirectMiddleWare uğrarız, o da bizi ana sayfaya gönderir. 
router.route('/login').get(redirectMiddleWare, pageControllers.getLogin);
router.route('/contact').get(pageControllers.getContact);
router.route('/contact').post(pageControllers.sendMessage);

module.exports = router;
