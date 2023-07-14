const mongoose = require('mongoose');
const folderSchema = new mongoose.Schema({
    // _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    isActive: {
        type: Boolean,
        default: true,
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
    }
});
const Folder = mongoose.model('Folder', folderSchema);
module.exports = Folder;
// const mongoose = require('mongoose');

// const folderSchema = new mongoose.Schema({
//     // _id: { type: mongoose.Schema.Types.ObjectId, required: true },
//     name: { type: String, required: true }
// });

// const Folder = mongoose.model('Folder', folderSchema);
// module.exports = Folder;
