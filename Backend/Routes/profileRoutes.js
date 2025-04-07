const express = require('express');
const profileController = require('../Controllers/profileController');
const profileMiddleware = require('../Midlewares/profileMiddleware');

const router = express.Router();

router.get('/',profileMiddleware,profileController.getParticularUser);
router.post('/giveAccess',profileController.giveAccess);

module.exports = router;