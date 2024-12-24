const express = require('express');
const router = express.Router();
const { 
        getUsers,
        userLogin,
        createUser,
        newConversation,
        getConversationById,
        continueConversation,
        getAllConversation
        } = require('../controllers/userController');
const  authenticateToken   = require('../middleware/authenticateToken');


router.route('/').get(authenticateToken,getUsers);

router.route('/register').post(createUser);    
router.route('/login').post(userLogin);  // user login
router.route('/new_conversation').post(authenticateToken, newConversation)
router.route('/conversation/:conversation_id').get(getConversationById)
// router.route('/continue_conversation').post(authenticateToken,continueConversation)
router.route('/conversation-history/:userId').get(getAllConversation)
// router.route('/profile').get(authenticateToken, (req, res) => {
//     res.json(req.user);
// });
// router.route('/user').get((req,res)=>{res.status(200).json({message:"this is message"})})

module.exports = router;