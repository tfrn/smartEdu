const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');

// create new course
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      user: req.session.userID,
    });
    req.flash('success', 'Course create succesfully!');
    res.status(201).redirect('/courses');
  } catch (error) {
    req.flash('error', 'Something happen!');
    res.status(400).redirect('/courses');
  }
};



// show all courses

exports.getAllCourse = async (req, res) => {
  try {
    const categorySlug = req.query.categories; // kategori için query oluşturduk.
    const query = req.query.search; // search için query oluşturduk.
    const category = await Category.findOne({ slug: categorySlug });
    let filter = {};
    if (categorySlug) {
      filter = { category: category._id };
    } // eğer kategorilerden birisi seçilmişse, seçilen kategori id'sini category içinde ara dedik.

    if (query) {
      filter = { name: query };
    } // eğer search'e bir şey yazılmışsa ve ara denmişse, yazılan değeri, kurs nameleri içinde içinde ara dedik.

    if (!query && !categorySlug) {
      // eğer query categoryslug ile seçim yapılmamışsa, boş name ve null kategory filtrele dedik.
      (filter.name = ''), (filter.category = null);
    }

    const courses = await Course.find({
      $or: [
        // hem query hem kategory sorgularına göre kursları bul diyoruz.
        { name: { $regex: '.*' + filter.name + '.*', $options: 'i' } }, // eğer query girilmişse name içerisinde, filterden gelen değerleri arıyoruz. options ile değerimizin büyükharf-küçük harf duyasız olacağını söylüyoruz. regex ile de başında, ortasında, sonunda olabileceğini söylüyoruz.
        { category: filter.category }, // eğer, filterden bir category seçimi gelmişse, o kategoriye sahip kursları dönderiyor.
      ],
    })
      .sort('-createdAt')
      .populate('user'); // .sort("-createAt") oluşturulma tarihine göre önce en son oluşturulanı gösterir. populate user döndermemizin sebebi de kursların altında oluşturan öğretmen bilgilerini de yazdırabilmek.
    const categories = await Category.find();
    res.status(200).render('courses', {
      courses,
      categories,
      page_name: 'courses',
    });
  } catch (error) {
    res.status(400).render('courses', {
      error,
    });
  }
};

// show single courses

exports.getSingleCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug }).populate(
      'user'
    );
    const categories = await Category.find();
    const user = await User.findById(req.session.userID);
    res.status(200).render('course', {
      course,
      categories,
      user,
      page_name: 'courses',
    });
  } catch (error) {
    res.status(400).render('course', {
      error,
    });
  }
};

// Enroll a course

exports.enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.push({ _id: req.body.course_id });
    await user.save();
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

// leave a course

exports.leaveCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.remove({ _id: req.body.course_id }); // remove yerine pull metodu da kullanılabilir.
    await user.save();
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

// delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndRemove({ slug: req.params.slug });
    req.flash('error', `${course.name} has been removed successfully`);
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

// update a course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    course.name = req.body.name;
    course.description = req.body.description;
    course.category = req.body.category;
    course.save();
    req.flash('success', `${course.name} has been update successfuly`);
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    req.flash('error', `Something happened!`);
    res.status(400).redirect('/users/dashboard');
  }
};

