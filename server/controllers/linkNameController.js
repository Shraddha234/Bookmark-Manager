const LinkName = require('../models/linkNameModel');

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

        const linkName = await LinkName.create({ name, url, folder: folderId });
        res.status(201).json(linkName);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add link name' });
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