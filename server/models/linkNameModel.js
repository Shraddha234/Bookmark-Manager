const mongoose = require('mongoose');
const Folder = require("../models/folderModel");
const mongooseAutopopulate = require('mongoose-autopopulate')
const linkNameSchema = new mongoose.Schema({
    // _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    url: { type: String },
    folder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Folder,
        autopopulate: true
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    userActions: [
        {
          userMail: {
            type: String,
          },
          actions: {
            type: [
              {
                type: String,
                enum: ['read', 'write', 'delete'],
                default: 'read'
              },
            ],
          },
        },
      ],
});

linkNameSchema.plugin(mongooseAutopopulate)

const LinkName = mongoose.model('LinkName', linkNameSchema);
module.exports = LinkName;

