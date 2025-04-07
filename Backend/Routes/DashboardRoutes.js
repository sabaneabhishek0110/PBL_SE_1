const express = require('express');
const dashboardController = require('../Controllers/dashboardController');
const userMiddleware = require('../Midlewares/userMiddleware');

const router = express.Router();

router.post('/createTeam',userMiddleware,dashboardController.CreateTeam);
router.get('/getAllTeams',userMiddleware,dashboardController.getAllTeams);

module.exports = router;

