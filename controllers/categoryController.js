const Category = require('../models/Category');

// create new Category
exports.createCategory = async (req, res) => {
    try {
    const category = await Category.create(req.body);
    req.flash('success', `category created successfully`);
    res.status(201).redirect('/users/adminpanel');
    } catch (error){
      req.flash('error', `category does not create!`);
      res.status(400).redirect('/users/adminpanel');
    }
  };
  
// delete a category

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndRemove({ _id: req.params.id });
    req.flash('error', `category deleted successfully`);
    res.status(200).redirect('/users/adminpanel');
  } catch (error) {
    req.flash('error', `category does not delete!`);
    res.status(400).redirect('/users/adminpanel');
  }
};

// update a category
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    category.name = req.body.name;
    category.save();
    req.flash('success', `category updated successfully`);
    res.status(200).redirect('/users/adminpanel');
  } catch (error) {
    req.flash('error', `category does not update!`);
    res.status(400).redirect('/users/adminpanel');
  }
};