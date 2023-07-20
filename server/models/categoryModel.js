//category model

const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        required: true,
    }
});
module.exports = mongoose.model('Category', categorySchema); 