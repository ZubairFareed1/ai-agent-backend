const express = require('express');
const router = express.Router();
const { 
        getUsers,
        userLogin,
        createUser,
        newConversation,
        getConversationById,
        continueConversation,
        getAllConversation,
        getLoginHistory,
        getUserInfo,
        deleteConversation,
        updateUser,
        updateProfilePicture,
        getProfilePicture
        } = require('../controllers/userController');
const  authenticateToken   = require('../middleware/authenticateToken');
const { upload } = require("../middleware/profile_picture");



router.route('/').get(authenticateToken,getUsers);

router.route('/register').post(createUser);    
router.route('/login').post(userLogin);  // user login
router.route('/new_conversation').post(authenticateToken, newConversation)
router.route('/conversation/:conversation_id').get(getConversationById)
router.route('/continue_conversation').post(authenticateToken,continueConversation)
router.route('/conversation-history/:userId').get(getAllConversation)
router.route('/login-history').post(authenticateToken,getLoginHistory)
router.route('/profile/:userId').get(authenticateToken, getUserInfo);
router.route('/delete_conversation/:conversation_id').delete(deleteConversation)
router.route('/update_user/:userId').put(authenticateToken, updateUser)
router.route('/update_profile_picture/:userId').post(upload.single('image'), updateProfilePicture)
router.route('/profile_picture/:userId').get(authenticateToken,getProfilePicture)

module.exports = router;