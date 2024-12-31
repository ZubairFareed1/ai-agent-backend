const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
     fileUpload,
     InsertWord, 
     getPreventWords, 
     deletePreventWords,
     getKnowledgeBase,
     deleteKnowledgeBase
     } = require('../controllers/adminController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); 
    }
});

const upload = multer({ storage });

router.route('/fileupload').post(upload.single('file'), fileUpload);
router.route('/prevent-words').post(InsertWord);
router.route('/prevent-words').get(getPreventWords);
router.route('/prevent-words').delete(deletePreventWords);
router.route('/knowledge-base').get(getKnowledgeBase);
router.route('/knowledge-base').delete(deleteKnowledgeBase);

module.exports = router;
