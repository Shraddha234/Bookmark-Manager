const LinkName = require('../models/linkNameModel');
const Folder = require('../models/folderModel')
const transporter = require('../nodemailer')
const sendEmail = require('../nodemailer')


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
exports.createLink = async (req, res) => {
    try {
    //   const { folderId } = req.params;
      const { name, url, folderId } = req.body;
  
      const link = new LinkName({ name, url });
      await link.save();
  
      const folder = await Folder.findById(folderId);
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


// exports.shareLink = async (req, res) => {
//     const { linkId } = req.params;
//     const { userMail, actions } = req.body;
  
//     try {
//       const link = await LinkName.findById(linkId);
//       if (!link) {
//         return res.status(404).json({ error: 'Link not found' });
//       }
  
//       const userIndex = link.userActions.findIndex(
//         (user) => user.userMail === userMail
//       );
  
//       if (userIndex !== -1) {
//         if (actions) {
//           link.userActions[userIndex].actions = actions;
//         }
//       } else {
//         link.userActions.push({ userMail, actions });
//       }
  
//       await link.save();
//       const recipients = link.userActions.map((user) => user.userMail);
      
//       const subject = 'You have received a shared Link!';
//       const actionsString = actions ? actions.join(', ') : '';
//       const html = `<p>Hello,</p><p>You have received a shared Link with the following actions: ${actionsString}</p>`;
//       await sendEmail(recipients, subject, html);
  
//       res.json({ message: 'Link shared successfully', link });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Server error' });
//     }
//   };


exports.shareLink = async (req, res) => {
  const { linkId } = req.params;
  const userActionsArray = req.body;

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

    await link.save();

    res.json({ message: 'Link shared successfully', link });
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

//CRUD operation of Linkname without folderId

// Add data to a Linkname without folderId

exports.addLink = async (req, res) => {

    try {
         const { name, url } = req.body;
         const linkName = await LinkName.create({ name, url});
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
  
   
  
  
