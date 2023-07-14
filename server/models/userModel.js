const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: [true, "Please enter the Password"]
    },

});

const user = mongoose.model("User", UserSchema);

module.exports = user;