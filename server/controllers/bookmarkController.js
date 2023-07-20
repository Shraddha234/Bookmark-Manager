const Bookmark = require('../models/bookmarkModel');
// Get all bookmarks

exports.getAllBookmarks = async (req, res) => {
    try {
        const bookmarks = await Bookmark.find().populate('category');
        res.json(bookmarks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Create a new Bookmark

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

//Edit a bookmark
exports.editBookmark = async (req, res) => {
    try {
        const { bookmarkId } = req.params;
        const { linkName, note, categoryId } = req.body;
        const bookmark = await Bookmark.findByIdAndUpdate(
            bookmarkId,
            { linkName, note, category: categoryId },
            { new: true }
        );
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }
        res.json(bookmark);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Move bookmark to another category

exports.moveBookmark = async (req, res) => {
    try {
        const { bookmarkId, targetCategoryId } = req.body;
        const bookmark = await Bookmark.findById(bookmarkId);
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }
        bookmark.category = targetCategoryId;
        await bookmark.save();
        res.json({ message: 'Bookmark moved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Delete bookmark

exports.deleteBookmark = async (req, res) => {
    try {
        const { bookmarkId } = req.params;
        const bookmark = await Bookmark.findByIdAndRemove(bookmarkId);
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }
        res.json({ message: 'Bookmark deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};