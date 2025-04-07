const express = require('express');
const documentController = require('../Controllers/documentController');

const router = express.Router();

router.get('/getUserDocuments',userMiddleware,documentController.getUserDocuments);

module.exports = router;