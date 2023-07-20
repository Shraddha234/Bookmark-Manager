const Bookmark = require('../models/bookmarkModel');

// Get all bookmarks

exports.getAllBookmarks = async(req, res) => {

        try {
      
            const Bookmarks = await Bookmark.find({ isActive: true });
            res.json(Bookmarks);
          
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Server error' });
        }
      
};

// Create a new Bookmark

exports.createBookmark = async (req, res) => {
    try {
        const { name, url, note, categoryId } = req.body;
        const bookmark = new Bookmark({ name, url, note, category: categoryId });
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
        const { name, url, note } = req.body;
        const bookmark = await Bookmark.findByIdAndUpdate(
            bookmarkId,
            { name,url, note },
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

// exports.moveBookmark = async (req, res) => {
//     try {
//         const { bookmarkId, targetCategoryId } = req.body;
//         const bookmark = await Bookmark.findById(bookmarkId);
//         if (!bookmark) {
//             return res.status(404).json({ error: 'Bookmark not found' });
//         }
//         bookmark.category = targetCategoryId;
//         await bookmark.save();
//         res.json({ message: 'Bookmark moved successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server Error' });
//     }
// };

// Delete bookmark

exports.deleteBookmark = async (req, res) => {
    try {
        const { deleteId } = req.params;
        const bookmark = await Bookmark.findByIdAndUpdate(deleteId, {isActive: false}, {new: true});
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }
        res.json({ message: 'Bookmark deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};
