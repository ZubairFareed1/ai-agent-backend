const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = 'src/profile_picture';
      cb(null, uploadPath); // Save images to 'uploads' folder
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName); // Save with unique filename
    },
  });

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'profile_picture/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     }
// });
const upload = multer({ storage: storage });

module.exports = {upload};