const mongoose = require('mongoose');
const Folder = require('./folderModel');
const User = require('./userModel');
const mongooseAutopopulate = require('mongoose-autopopulate');

const linkNameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Folder,
    autopopulate: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  links: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LinkName' }],
  belongsToFolder: { type: Boolean, default: true },
  sharedBy: {
    type: String, 
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
            default: 'read',
          },
        ],
      },
    },
  ],
});

linkNameSchema.plugin(mongooseAutopopulate);

const LinkName = mongoose.model('LinkName', linkNameSchema);
module.exports = LinkName;
