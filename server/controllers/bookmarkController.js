const Bookmark = require('../models/bookmarkModel');
const Category = require('../models/categoryModel');
const transporter = require('../nodemailer');
const sendEmail = require('../nodemailer')

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
// exports.getAllBookmarks = async (req, res) => {
//     const { categoryId } = req.params;
//     try {
//       const category = await Category.findById(categoryId);
//       if (!category) {
//         return res.status(404).json({ error: 'Category not found' });
//       }
   
//       const bookmarks = category.bookmarks;
//       res.json(bookmarks);
//     } catch (error) {
//       res.status(500).json({ error: 'Server error' });
//     }
//    };

// Create a new Bookmark

exports.createBookmark = async (req, res) => {
    try {
        const { name, url, note, categoryId } = req.body;

        const category = await Category.findById(categoryId);
        if (!category) {
          return res.status(404).json({ error: 'Category not found' });
        }
        const bookmark = new Bookmark({ name, url, note, category: categoryId });
        await bookmark.save();
        category.bookmarks.push(bookmark);
        await category.save();
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


// exports.shareBookmark = async (req, res) => {
//     const { categoryId, bookmarkId } = req.params;
//     const { userMail, actions } = req.body;
  
//     try {
//       const category = await Category.findById(categoryId);
//       if (!category) {
//         return res.status(404).json({ error: 'Category not found' });
//       }
  
//       // Find the bookmark by its _id in the bookmarks array of the category
//       const bookmark = await Bookmark.findById(bookmarkId).populate('category');
//       if (!bookmark) {
//         return res.status(404).json({ error: 'Bookmark not found' });
//       }
  
//       // Update the bookmark properties
//       bookmark.userMail = userMail;
//       bookmark.actions = actions;
//       await bookmark.save();

    
//       res.json({ message: 'Bookmark shared successfully', bookmark });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Server error' });
//     }
//   };


exports.shareBookmark = async (req, res) => {
  const { categoryId, bookmarkId } = req.params;
  const { userMail, actions } = req.body;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Find the bookmark by its _id in the bookmarks array of the category
    const bookmark = await Bookmark.findById(bookmarkId).populate('category');
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    // Update the bookmark properties
    bookmark.userMail = userMail;
    bookmark.actions = actions;
    await bookmark.save();

    // Send email to the userMail
    const subject = 'You have received a shared bookmark!';
    const html = `<p>Hello,</p><p>You have received a shared bookmark with the following actions: ${actions.join(', ')}</p>`;
    sendEmail(userMail, subject, html);

    res.json({ message: 'Bookmark shared successfully', bookmark });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


  
  exports.viewBookmark = async (req, res) => {
    try {
      const { categoryId } = req.params;
      const category = await Category.findById(categoryId).populate('bookmarks');
   
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
   
      // Create an array to store the data for each bookmark
   const bookmarkData = category.bookmarks.map((bookmark) => ({
    category: category.name,
       bookmarkName: bookmark.name,
       actions: bookmark.actions,
       userMail: bookmark.userMail || [],
       username: bookmark.userMail? extractNameFromEmail(bookmark.userMail) : null,
   }));
   res.json(bookmarkData);
 } catch (error) {
   console.error(error);
   res.status(500).json({ error: 'Server error' });
 }
};  

function extractNameFromEmail(email){
    const username = email.split('@')[0];
    return username;
}
  