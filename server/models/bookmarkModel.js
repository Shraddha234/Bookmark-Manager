const mongoose = require('mongoose');
const bookmarkSchema = new mongoose.Schema({
    linkName: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    note: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
});
module.exports = mongoose.model('Bookmark', bookmarkSchema);