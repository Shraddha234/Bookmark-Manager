const Category = require('../models/categoryModel');
exports.createCategory = async (req, res) => {
    try {
        const { name, position } = req.body;
        const category = new Category({ name, position });
        await category.save();
        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Get all categories

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

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
        const category = await Category.findByIdAndRemove(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Move category to another category

exports.moveCategory = async (req, res) => {
    try {
        const { categoryId, targetCategoryId } = req.body;
        // Get the category to move
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        // Get the target category
        const targetCategory = await Category.findById(targetCategoryId);
        if (!targetCategory) {
            return res.status(404).json({ error: 'Target category not found' });
        }
        // Swap the positions of the two categories
        const tempPosition = category.position;
        category.position = targetCategory.position;
        targetCategory.position = tempPosition;
        // Save the changes
        await Promise.all([category.save(), targetCategory.save()]);
        // await category.save();
        // await targetCategory.save();
        res.json({
            message: 'Category moved successfully',
            category: category
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};