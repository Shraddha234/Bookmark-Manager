const mongoose = require('mongoose');
const User = require('./userModel');

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  sharedBy: {
    type: String,
  },
  links: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LinkName' }],
  folders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Folder'}],
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

const Folder = mongoose.model('Folder', folderSchema);

module.exports = Folder;
