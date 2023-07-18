const Bookmark = require('../models/bookmarkModel');
exports.createBookmark = async (req, res) => {
    try {
        const { linkName, name, note, categoryId } = req.body;
        const bookmark = new Bookmark({ linkName, name, note, category: categoryId });
        await bookmark.save();
        res.json(bookmark);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};