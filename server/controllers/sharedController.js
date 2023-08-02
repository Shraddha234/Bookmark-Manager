const User = require('../models/userModel');
const LinkName = require('../models/linkNameModel');
const Folder = require('../models/folderModel');

// exports.viewShared = async (req, res) => {
//   try {
//     const userName = req.userName;
//     const sharedLinks = await LinkName.find({ 'userActions.userMail': userName }).populate('sharedBy', 'name');
//     const sharedFolders = await Folder.find({ 'userActions.userMail': userName  }).populate('sharedBy', 'name');;

//     // Assuming you have a middleware to extract the user's email and store it in req.userMail

//     const sharedData = {
//       sharedLinks: sharedLinks.map((link) => ({
//         linkName: link.name,
//         url: link.url,
//         access: link.userActions.find((userAction) => userAction.userMail === userName)?.actions || [],
//         sharedBy: link.sharedBy ? link.sharedBy.name : 'Unknown User',
//       })),
//       sharedFolders: sharedFolders.map((folder) => ({
//         folderName: folder.name,
//         access: folder.userActions.find((userAction) => userAction.userMail === userName)?.actions || [],
//         sharedBy: folder.sharedBy ? folder.sharedBy.name : 'Unknown User',
//       })),
//     };

//     res.json(sharedData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };



// exports.viewShared = async (req, res) => {
//   try {
//     const userMail = req.user.email;

//     const sharedLinks = await LinkName.find({ 'userActions': { $elemMatch: { userMail } } })
//       .populate('sharedBy', 'name');

//     const sharedFolders = await Folder.find({ 'userActions': { $elemMatch: { userMail } } })
//       .populate('sharedBy', 'name');

//     const sharedData = {
//       sharedLinks: sharedLinks.map((link) => ({
//         linkId: link.id,
//         linkName: link.name,
//         url: link.url,
//         access: link.userActions.find((userAction) => userAction.userMail === userMail)?.actions || [],
//         sharedBy: link.sharedBy ? link.sharedBy.name : 'Unknown User',
//       })),
//       sharedFolders: sharedFolders.map((folder) => ({
//         folderId: folder.id,
//         folderName: folder.name,
//         access: folder.userActions.find((userAction) => userAction.userMail === userMail)?.actions || [],
//         sharedBy: folder.sharedBy ? folder.sharedBy.name : 'Unknown User',
//       })),
//     };

//     res.json(sharedData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// Assuming you have the necessary imports and setup for express, mongoose, etc.

exports.viewShared = async (req, res) => {
  const sharedBy = req.user && req.user.email ? req.user.email : null;
  try {
    const userMail = req.user && req.user.email ? req.user.email : null;
    if (!userMail) {
      return res.status(400).json({ error: 'User not authenticated' });
    }

    const sharedLinks = await LinkName.find({ 'userActions.userMail': userMail }).populate('sharedBy', 'name');
    const sharedFolders = await Folder.find({ 'userActions.userMail': userMail }).populate('sharedBy', 'name');

    const sharedData = {
      sharedLinks: sharedLinks.map((link) => ({
        linkId: link.id,
        linkName: link.name,
        url: link.url,
        access: link.userActions.find((userAction) => userAction.userMail === userMail)?.actions || [],
        sharedBy: link.sharedBy ? link.sharedBy : 'Unknown User',
        // sharedBy: sharedBy,
      })),
      sharedFolders: sharedFolders.map((folder) => ({
        folderId: folder.id,
        folderName: folder.name,
        access: folder.userActions.find((userAction) => userAction.userMail === userMail)?.actions || [],
        sharedBy: folder.sharedBy ? folder.sharedBy : 'Unknown User',
        // sharedBy: sharedBy,
      })),
    };

    res.json(sharedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


// exports.viewShared = async (req, res) => {
//   const sharedBy = req.user && req.user.email ? req.user.email : null;

//   try {
//     const userMail = req.user && req.user.email ? req.user.email : null;
//     if (!userMail) {
//       return res.status(400).json({ error: 'User not authenticated' });
//     }

//     // Get the folders shared with the current user's email
//     const receivedFolders = await Folder.find({ 'userActions.userMail': userMail}).populate('sharedBy', 'name');
//     const sharedFolders = receivedFolders.filter(folder => folder.sharedBy !== userMail);

//     console.log("shared",sharedBy)

//     const sharedData = {
//       sharedFolders: sharedFolders.map((folder) => ({
//         folderId: folder.id,
//         folderName: folder.name,
//         access: folder.userActions.find((userAction) => userAction.userMail === userMail)?.actions || [],
//         sharedBy: sharedBy 
//       })),
//     };

//     res.json(sharedData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };


  