const Folder = require('../models/folderModel');

// Controller methods for handling folder-related operations
exports.getAllFolders = async (req, res) => {
  try {
    const folders = await Folder.find();
    res.json(folders);
  } catch (error) {
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


// SELECT a folder

 exports.selectFolder =  async (req, res) => {

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

      const folder = await Folder.findByIdAndUpdate(folderIds, {isActive: false}, {new: true});

      if (!folder) {

        return res.status(404).json({ error: 'Folder not found' });

      }

      return res.json({ message: 'Folder deactivated successfully' });

    }

    await Folder.updateMany({ _id: { $in: folderId } },{isActive: false}, {new: true});

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

router.get('/search',folderController.searchFolders)
