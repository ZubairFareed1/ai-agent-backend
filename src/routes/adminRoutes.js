const express = require('express');
const router = express.Router();

const { fileUpload } = require('../controllers/adminController')

router.route('/fileupload').post(fileUpload)

module.exports = router