const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');
const linkNameController = require('../controllers/linkNameController');
const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryController')
const bookmarlController = require('../controllers/bookmarkController')


// Folder routes
router.get('/folders', folderController.getAllFolders);
// Add other folder routes as needed

// LinkName routes
router.get('/linknames', linkNameController.getAllLinkNames);

//Create folder routes
router.post('/createfolder', folderController.createFolder);

//Save folder data routes
// router.post('/add-data/:folderId', folderController.addDataToFolder);

//Edit folder routes
router.put("/editfolder/:folderId", folderController.editFolder);

//Delete folder routes
router.delete("deletefolder/:folderId", folderController.deleteFolder);

//search folder API using keyword
router.get('/search', folderController.searchFolders)

//LinkName create, edit, delete APIs 
router.post('/link-names', linkNameController.addLinkName);
router.put('/link-names/:linkNameId', linkNameController.editLinkName);
router.delete('/link-names/:linkNameId', linkNameController.deleteLinkName);


//Select Folder
router.put("/select", folderController.selectFolder);

//cancel
router.put("/cancel", folderController.cancelFolder);

//Move folders
router.put("/move", folderController.moveFolder);

//delete
router.delete("/delete", folderController.deleteSelectFolder)

//category create, edit, delete and move

router.post('/createCategory', categoryController.createCategory);

router.get('/categories', categoryController.getAllCategories);

router.put('/editCategory/:categoryId', categoryController.editCategory);

router.delete('/deletecategory/', categoryController.deleteSelectCategory);

router.put('/moveCategory', categoryController.moveCategory);

//bookmark create,edit, delete and move

router.post('/createBookmark', bookmarlController.createBookmark);

router.get('/bookmarks', bookmarlController.getAllBookmarks);

router.put('/editBookmark/:bookmarkId', bookmarlController.editBookmark);

router.delete('/deleteBookmark/:deleteId', bookmarlController.deleteBookmark);

// router.put('/moveBookmark', bookmarlController.moveBookmark);
 
//* user routes

// To check Token Authentication 
router.get('/checkTokenAuth', userController.verifyJwt, userController.checkTokenAuthentication);

// Login Module route
router.post('/login', userController.loginController);

// Signup Module 
router.post('/signup', userController.signUpController);

// SSO Login Module Route
router.post('/sso-login', userController.ssoLoginController);


module.exports = router;
