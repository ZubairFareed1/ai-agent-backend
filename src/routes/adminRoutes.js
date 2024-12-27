const express = require('express');
const multer = require('multer');
const router = express.Router();
const { fileUpload, InsertWord, getPreventWords, deletePreventWords } = require('../controllers/adminController');

// Configure multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory where files will be saved
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // File naming convention
    }
});

const upload = multer({ storage });

router.route('/fileupload').post(upload.single('file'), fileUpload);
router.route('/prevent-words').post(InsertWord);
router.route('/prevent-words').get(getPreventWords);
router.route('/prevent-words').delete(deletePreventWords);

module.exports = router;
