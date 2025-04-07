const express = require('express');
const profileMiddleware = require('../Midlewares/profileMiddleware');
const notificationController = require('../Controllers/notificationController');

const router = express.Router();

router.post('/addRequest',profileMiddleware,notificationController.addToGroupRequest);
router.get('/getNotifications',profileMiddleware,notificationController.getNotifications);

module.exports = router;