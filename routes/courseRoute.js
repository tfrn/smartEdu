const express = require('express');
const courseController = require('../controllers/courseController');
const roleMiddleWare = require('../middleWares/roleMiddleWare');

const router = express.Router();

router.route('/').post(roleMiddleWare(["teacher", "admin"]), courseController.createCourse); // http://localhost:3000/courses // eğer, kullanıcı rolü teacher veya admin değilse yeni kurs oluşturamaz.  
router.route('/').get(courseController.getAllCourse);
router.route('/:slug').get(courseController.getSingleCourse);
router.route('/enroll').post(courseController.enrollCourse);
router.route('/leave').post(courseController.leaveCourse);
router.route('/:slug').delete(courseController.deleteCourse);
router.route('/:slug').post(courseController.updateCourse);
module.exports = router;

