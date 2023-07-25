const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    // _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    isActive: {
        type: Boolean,
        default: true,
    },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bookmark' }],
});
module.exports = mongoose.model('Category', categorySchema);