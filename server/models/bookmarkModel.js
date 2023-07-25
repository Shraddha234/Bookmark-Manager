const mongoose = require('mongoose');
const Category = require("../models/categoryModel");
const mongooseAutopopulate = require('mongoose-autopopulate')
const bookmarkSchema = new mongoose.Schema({
    // _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    url: { type: String },
    note: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Category,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    userMail: {
        type: String,
    },
    actions: { type: [String], enum: ['read', 'write', 'delete'] },
});
bookmarkSchema.plugin(mongooseAutopopulate)
module.exports = mongoose.model('Bookmark', bookmarkSchema);