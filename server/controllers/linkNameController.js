const LinkName = require('../models/linkNameModel');
const Folder = require('../models/folderModel')
const sendEmail = require('../nodemailer')
const { isValidObjectId } = require('mongoose');


exports.getAllLinkNames = async(req, res) => {

            try {
              
                const LinkNames = await LinkName.find({ isActive: true });
                res.json(LinkNames);
              
            } catch (error) {
              console.error(error);
              res.status(500).json({ error: 'Server error' });
            }
          
};
// Add data to a Linkname
exports.addLinkName = async (req, res) => {
    try {
      const { name, url, folderId } = req.body;
  
      const link = new LinkName({ name, url, folder: folderId });
      await link.save();
  
      const folder = await Folder.findById(folderId)
      if (!folder) {
        return res.status(404).json({ error: 'Folder not found' });
      }
  
      folder.links.push(link); // Push the link ObjectId to the "links" array
      await folder.save();
  
      res.json({ message: 'Link created successfully', link });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
// Edit an existing link name
exports.editLinkName = async (req, res) => {
    try {
        const { linkNameId } = req.params;
        const { name, url } = req.body;

        const updatedLinkName = await LinkName.findByIdAndUpdate(
            linkNameId,
            { name, url },
            { new: true }
        );

        if (!updatedLinkName) {
            return res.status(404).json({ error: 'Link name not found' });
        }

        res.json(updatedLinkName);
    } catch (error) {
        res.status(500).json({ error: 'Failed to edit link name' });
    }
};
// Delete a link name
exports.deleteLinkName = async (req, res) => {
    try {
        const { linkNameId } = req.params;
        
        const deletedLinkName = await LinkName.findByIdAndUpdate(linkNameId, {isActive: false}, {new: true});
        if (!deletedLinkName) {
            return res.status(404).json({ error: 'Link name not found' });
        }
        res.json({ message: 'Link name deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete link name' });
    }
};


exports.shareLink = async (req, res) => {
  const { linkId } = req.params;
  const userActionsArray = req.body;

  console.log('linkId:', linkId);
  console.log('userActionsArray:', userActionsArray);
  console.log('Request User:', req.user);

  const sharedBy = req.user && req.user.email ? req.user.email : null;

  console.log('sharedBy:', sharedBy);

  try {
    const link = await LinkName.findById(linkId);
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    if (!Array.isArray(userActionsArray)) {
      return res.status(400).json({ error: 'Invalid userActions. Expected an array of user objects containing userMail and actions.' });
    }

    userActionsArray.forEach(({ userMail, actions }) => {
      const userIndex = link.userActions.findIndex((user) => user.userMail === userMail);
      if (userIndex !== -1) {
        link.userActions[userIndex].actions = actions;
      } else {
        link.userActions.push({ userMail, actions });
      }

      const subject = 'You have received a shared Link!';
      const html = `<p>Hello,</p><p>You have received a shared Link with the following actions: ${actions.join(', ')}</p>`;
      sendEmail(userMail, subject, html);
    });

    link.sharedBy = sharedBy;

    await link.save();

    const linkData = {
      _id: link._id,
      linkName: link.name,
      url: link.url,
      actions: link.actions,
      userActions: link.userActions.map((userAction) => ({
        userMail: userAction.userMail,
        username: extractNameFromEmail(userAction.userMail),
        actions: userAction.actions,
      })),
      sharedBy: sharedBy,
    };

    res.json({ message: 'Link shared successfully', linkData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

  


   
exports.viewLink = async (req, res) => {
    try {
        const { folderId,linkId } = req.params;
        const folder = await Folder.findById(folderId).populate('links');
     
        if (!folder) {
          return res.status(404).json({ error: 'Folder not found' });
        }

      const link = folder.links.find((link) => link._id.toString() === linkId);
        if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
  
      const linkData = folder.links.map((link) => ({
        linkName: link.name,
        url: link.url,
        folder: folder.name,
        actions: link.actions,
        userActions: link.userActions.map((userAction) => ({
          userMail: userAction.userMail,
          username: extractNameFromEmail(userAction.userMail),
          actions: userAction.actions,
        })),
      }));

      res.json(linkData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
};

function extractNameFromEmail(email) {
    if (typeof email !== 'string') {
      return null; // Return null or any other default value if the email is not valid
    }
  
    const username = email.split('@')[0];
    return username;
}


// Add data to a Linkname without folderId

exports.addLink = async (req, res) => {
    try {
      const { name, url } = req.body;
      const linkName = new LinkName({ name, url, belongsToFolder: false }); // Set belongsToFolder to false for links without a folder
      await linkName.save(); // Corrected the line here by adding parentheses
      res.status(201).json(linkName);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add link name' });
    }
  };
  
  // Edit an existing link name without folderId
  
  exports.editLink = async (req, res) => {
    try {
        const { linkNameId } = req.params;
        const { name, url } = req.body; 
    const updatedLinkName = await LinkName.findByIdAndUpdate(
        linkNameId,
         { name, url },
         { new: true }
         );
        if (!updatedLinkName) {
            return res.status(404).json({ error: 'Link name not found' });
        }
        res.json(updatedLinkName);
    } catch (error) {
        res.status(500).json({ error: 'Failed to edit link name' });
    }
  
  };
  
  // Delete a link name without folderId
  
  exports.deleteLink = async (req, res) => {
  try {
    const { linkNameId } = req.params;
    const deletedLinkName = await LinkName.findByIdAndUpdate(linkNameId, {isActive: false}, {new: true});
    if (!deletedLinkName) {
        return res.status(404).json({ error: 'Link name not found' });
    }
    res.json({ message: 'Link name deleted successfully' });
} catch (error) {
    res.status(500).json({ error: 'Failed to delete link name' });
  }
};

// Share link without folderId

exports.shareLinkNoFolderId = async (req, res) => {
    const { linkId } = req.params;
    const userActionsArray = req.body;
    const sharedBy = req.user ? req.user._id : null;
  
    try {
      if (!isValidObjectId(linkId)) {
        return res.status(400).json({ error: 'Invalid linkId' });
      }

      const link = await LinkName.findById(linkId);
      if (!link) {
        return res.status(404).json({ error: 'Link not found' });
      }
  
      if (!Array.isArray(userActionsArray)) {
        return res.status(400).json({ error: 'Invalid userActions. Expected an array of user objects containing userMail and actions.' });
      }
  
      userActionsArray.forEach(({ userMail, actions }) => {
        const userIndex = link.userActions.findIndex((user) => user.userMail === userMail);
        if (userIndex !== -1) {
          link.userActions[userIndex].actions = actions;
        } else {
          link.userActions.push({ userMail, actions });
        }
  
        const subject = 'You have received a shared Link!';
        const actionsString = actions ? actions.join(', ') : '';
        const html = `<p>Hello,</p><p>You have received a shared Link with the following actions: ${actionsString}</p>`;
        sendEmail(userMail, subject, html);
      });
      link.sharedBy = sharedBy;
  
      await link.save();
  
      res.json({ message: 'Link shared successfully', link });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  exports.viewLinkNoFolderId = async (req, res) => {
    try {
      const links = await LinkName.find({ belongsToFolder: false });
  
      if (!links || links.length === 0) {
        return res.status(404).json({ error: 'No links found' });
      }
  
      const linkData = links.map((link) => ({
        linkName: link.name,
        url: link.url,
        isActive: link.isActive,
      }));
  
      res.json(linkData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };


//delete useractions from link
exports.deleteUserActionFromLink = async (req, res) => {
    try {
      const { linkId, userActionId } = req.params;
      const link = await LinkName.findById(linkId);
      if (!link) {
        return res.status(404).json({ error: 'Link not found' });
        }

      // Find the index of the user action with the given userActionId
      const userActionIndex = link.userActions.findIndex(
        (userAction) => userAction._id.toString() === userActionId
      );
      if (userActionIndex === -1) {
        return res.status(404).json({ error: 'User action not found in the link' });  
    }
  
      // Remove the user action from the link's userActions array
      link.userActions.splice(userActionIndex, 1);
      await link.save();
      res.json({ message: 'User action deleted from link successfully' });
      } catch (error) {
      console.error(error);  
    res.status(500).json({ error: 'Server error' });
    }
  };

  exports.ViewAccess = async (req, res) => {
    try {
      const { linkNameId } = req.params;
      const link = await LinkName.findById(linkNameId);
      if (!link) {
        return res.status(404).json({ error: "Link name not found" });
      }
      res.json({ userActions: link.userActions });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete link name" });
    }
  };
 
    


  
  // exports.viewLinksWithoutFolder = async (req, res) => {
  //   try {
  //     // Query the database to find all links with null or undefined folderId
  //     const links = await LinkName.find({ folder: null });
  
  //     // Return the result as a response in JSON format
  //     res.json(links);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Server error' });
  //   }
  // };
   
  
  
