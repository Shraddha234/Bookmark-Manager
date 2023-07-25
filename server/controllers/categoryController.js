const Category = require('../models/categoryModel');
const Bookmark = require('../models/bookmarkModel')

exports.createCategory = async (req, res) => {
    try {
      const { name } = req.body;
      const category = await Category.create({ name });
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create category' });
    }
  };
exports.getAllCategories  = async (req, res) => {
    try {
      if (typeof req.query.keyword === 'string') {  
        const keyword = String(req.query.keyword); 
        const categories = await Category.find({ name: { $regex: keyword, $options: 'i' }, isActive: true });
        res.json(categories);
      } else {
        const categories = await Category.find({ isActive: true });
        res.json(categories);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };

// Get all categories



// Edit category

  

exports.editCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name } = req.body;
        const category = await Category.findByIdAndUpdate(
            categoryId,
            { name },
            { new: true }
        );
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Delete category

exports.deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findByIdAndUpdate(categoryId, { isActive: false }, { new: true });
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};
exports.deleteSelectCategory = async (req, res) => {
  try {
    const { categoryId }  = req.body;

    if (!Array.isArray(categoryId) || categoryId.length === 0) {
      return res.status(400).json({ error: "No category selected" });
    }

    if (categoryId.length === 1) {
      const categoryIds = categoryId[0];

      const category = await Category.findByIdAndUpdate(
        categoryIds,
        { isActive: false },
        { new: true }
      );

      if (!category) {
        return res.status(404).json({ error: "Folder not found" });
      }

      return res.json({ message: "Folder deactivated successfully" });
    }

    await Category.updateMany(
      { _id: { $in: categoryId } },
      { isActive: false },
      { new: true }
    );

    res.json({ message: "Selected folders deactivated successfully" });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Server Error" });
  }
};

// Move category to another category

exports.moveCategory  = async (req, res) => {
  try {
    const { selectedLinks, targetCategoryId } = req.body;

    if (!Array.isArray(selectedLinks) || selectedLinks.length === 0) {
      return res.status(400).json({ error: "No links selected" });
    }

    if (!targetCategoryId) {
      return res.status(400).json({ error: "Target category ID not provided" });
    }

    const targetCategory= await Category.findById(targetCategoryId);

    if (!targetCategory) {
      return res.status(404).json({ error: "Target category not found" });
    }

    const links = await Bookmark.find({ _id: { $in: selectedLinks } });

    if (!links || links.length === 0) {
      return res.status(404).json({ error: "Selected links not found" });
    }

    for (const link of links) {
      link.category = targetCategoryId;

      await link.save();
    }

    res.json({ message: "Selected links moved successfully" });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Server Error" });
  }
};