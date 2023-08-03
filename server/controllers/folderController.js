const Folder = require('../models/folderModel');
const LinkName = require('../models/linkNameModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const sendEmail = require('../nodemailer');
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose');





// Controller methods for handling folder-related operations
exports.getAllFolders = async (req, res) => {
  try {
    if (typeof req.query.keyword === 'string') {  
      const keyword = String(req.query.keyword); 
      const folders = await Folder.find({ name: { $regex: keyword, $options: 'i' }, isActive: true });
      res.json(folders);
    } else {
      const folders = await Folder.find({ isActive: true });
      res.json(folders);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new folder
exports.createFolder = async (req, res) => {
  try {
    const { name } = req.body;
    const folder = await Folder.create({ name });
    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create folder' });
  }
};

// Add data to a folder
exports.addDataToFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { name, url } = req.body;

    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    // Add the data to the folder
    folder.data.push({ name, url });
    const updatedFolder = await folder.save();

    res.json(updatedFolder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add data to folder' });
  }
};

// Edit an existing folder
exports.editFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { name, url } = req.body;

    const updatedFolder = await Folder.findByIdAndUpdate(
      folderId,
      { name, url },
      { new: true }
    );

    if (!updatedFolder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    res.json(updatedFolder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to edit folder' });
  }
};


// Delete a folder
exports.deleteFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const deletedFolder = await Folder.findByIdAndUpdate(folderId, { isActive: false }, { new: true });
    if (!deletedFolder) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    res.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete folder' });
  }
};




exports.shareFolder = async (req, res) => {
  const { folderId } = req.params;
  const userActionsArray = req.body;
  
  console.log('folderId:', folderId);
  console.log('userActionsArray:', userActionsArray);
  console.log('Request User:', req.user);
  
  const sharedBy = req.user && req.user.email ? req.user.email : null;
  
  console.log('sharedBy:', sharedBy);
  try {

    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    if (!Array.isArray(userActionsArray)) {
      return res.status(400).json({ error: 'Invalid userActions. Expected an array of user objects containing userMail and actions.' });
    }

    userActionsArray.forEach(({ userMail, actions }) => {
      const userIndex = folder.userActions.findIndex((user) => user.userMail === userMail);
      if (userIndex !== -1) {
        folder.userActions[userIndex].actions = actions;
      } else {
        folder.userActions.push({ userMail, actions });
      }

      const subject = 'You have received a shared Folder!';
      const html = `<p>Hello,</p><p>You have received a shared Folder with the following actions: ${actions.join(', ')}</p>`;
      sendEmail(userMail, subject, html);
    });

    folder.sharedBy = sharedBy;

    await folder.save();

    const folderData = {
      _id: folder._id,
      folderName: folder.name,
      actions: folder.actions,
      userActions: folder.userActions.map((userAction) => ({
        userMail: userAction.userMail,
        username: extractNameFromEmail(userAction.userMail),
        actions: userAction.actions,
      })),
      sharedBy: sharedBy,
    };

    res.json({ message: 'Folder shared successfully', folderData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};






exports.viewFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const folder = await Folder.findById(folderId).populate('folders');

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const getUserActionsRecursive = (folder) => {
      return {
        folderName: folder.name,
        actions: folder.actions,
        userActions: folder.userActions.map((userAction) => ({
          _id:userAction._id,
          userMail: userAction.userMail,
          username: extractNameFromEmail(userAction.userMail),
          actions: userAction.actions,
        })),
        subfolders: folder.folders.map((subfolder) => getUserActionsRecursive(subfolder)),
      };
    };

    const folderData = getUserActionsRecursive(folder);

    res.json(folderData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


function extractNameFromEmail(email) {
  if (typeof email !== 'string') {
    return null; 
  }

  const username = email.split('@')[0];
  return username;
}





// SELECT a folder

exports.selectFolder = async (req, res) => {

  try {

    const { folderId, selectAll } = req.body;


    if (selectAll) {

      await Folder.updateMany({}, { selected: true });

      return res.json({ message: 'All folders selected' });

    }


    if (Array.isArray(folderId) && folderId.length > 0) {

      await Folder.updateMany({ _id: { $in: folderId } }, { selected: true });

      return res.json({ message: 'Folders selected successfully' });

    }


    return res.status(400).json({ error: 'No folders selected' });

  } catch (error) {

    console.error(error);

    res.status(500).json({ error: 'Server Error' });

  }

};


// CANCEL SELECT on all folders

exports.cancelFolder = async (req, res) => {

  try {

    const { folderId } = req.body;


    if (!Array.isArray(folderId) || folderId.length === 0) {

      return res.status(400).json({ error: 'No folders selected' });

    }


    await Folder.updateMany({ _id: { $in: folderId } }, { selected: false });


    res.json({ message: 'Selection canceled successfully' });

  } catch (error) {

    console.error(error);

    res.status(500).json({ error: 'Server Error' });

  }

};


// MOVE selected links to another folder

exports.moveFolder = async (req, res) => {

  try {

    const { selectedLinks, targetFolderId } = req.body;


    if (!Array.isArray(selectedLinks) || selectedLinks.length === 0) {

      return res.status(400).json({ error: 'No links selected' });

    }


    if (!targetFolderId) {

      return res.status(400).json({ error: 'Target folder ID not provided' });

    }


    const targetFolder = await Folder.findById(targetFolderId);

    if (!targetFolder) {

      return res.status(404).json({ error: 'Target folder not found' });

    }


    const links = await LinkName.find({ _id: { $in: selectedLinks } });

    if (!links || links.length === 0) {

      return res.status(404).json({ error: 'Selected links not found' });

    }


    for (const link of links) {

      link.folder = targetFolderId;

      await link.save();

    }


    res.json({ message: 'Selected links moved successfully' });

  } catch (error) {

    console.error(error);

    res.status(500).json({ error: 'Server Error' });

  }

};


// DELETE selected folders

exports.deleteSelectFolder = async (req, res) => {

  try {

    const { folderId } = req.body;

    if (!Array.isArray(folderId) || folderId.length === 0) {

      return res.status(400).json({ error: 'No folders selected' });

    }

    if (folderId.length === 1) {

      const folderIds = folderId[0];

      const folder = await Folder.findByIdAndUpdate(folderIds, { isActive: false }, { new: true });

      if (!folder) {

        return res.status(404).json({ error: 'Folder not found' });

      }

      return res.json({ message: 'Folder deactivated successfully' });

    }

    await Folder.updateMany({ _id: { $in: folderId } }, { isActive: false }, { new: true });

    res.json({ message: 'Selected folders deactivated successfully' });

  } catch (error) {

    console.error(error);

    res.status(500).json({ error: 'Server Error' });

  }

};
// //create folder api for sidebar folder
// exports.createFolder = async (req, res) => {
//     try {
//         const { name } = req.body;

//         if (!name) {
//             return res.status(400).json({ error: 'Name is required' });
//         }

//         const folder = new Folder({ name });
//         const savedFolder = await folder.save();

//         res.status(201).json(savedFolder);
//     } catch (error) {
//         console.error('Failed to create folder:', error);
//         res.status(500).json({ error: 'Failed to create folder' });
//     }
// };

//edit folder api for sidebar folder
exports.editFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const folder = await Folder.findByIdAndUpdate(
      folderId,
      { name },
      { new: true }
    );

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    res.json(folder);
  } catch (error) {
    console.error('Failed to edit folder:', error);
    res.status(500).json({ error: 'Failed to edit folder' });
  }
};


//delete folder api for sidebar folder
exports.deleteFolder = async (req, res) => {
  try {
    const { folderId } = req.params;

    const folder = await Folder.findByIdAndUpdate(folderId, { isActive: false }, { new: true });

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    res.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    console.error('Failed to delete folder:', error);
    res.status(500).json({ error: 'Failed to delete folder' });
  }
};

//search folder using keywords
exports.searchFolders = async (req, res) => {
  try {
    const { keyword } = req.query;
    const folders = await Folder.find({ name: { $regex: keyword, $options: 'i' } });
    res.json(folders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.checkTokenAuthentication = (req, res) => {
  try {
    console.log(req.user); 

    return res.status(200).send({ message: "user is valid", data: "Authenticated", status: true });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

//delete useractions from folder
exports.deleteUserActionFromFolder = async (req, res) => {
  try {
    const { folderId, userActionId } = req.params;
    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    // Find the index of the user action with the given userActionId
    const userActionIndex = folder.userActions.findIndex(
      (userAction) => userAction._id.toString() === userActionId
    );
    if (userActionIndex === -1) {
      return res.status(404).json({ error: 'User action not found in the folder' });
    }

    // Remove the user action from the folder's userActions array
    folder.userActions.splice(userActionIndex, 1);
    await folder.save();
    res.json({ message: 'User action deleted from folder successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
