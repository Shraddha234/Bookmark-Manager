const Category = require('../models/categoryModel');




exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = new Category({ name });
        await category.save();
        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};