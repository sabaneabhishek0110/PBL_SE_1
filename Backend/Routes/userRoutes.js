const express = require('express');
const userController = require('../Controllers/userController');
const passport = require("passport");
const userMiddleware = require('../Midlewares/userMiddleware');

const router = express.Router();

router.post('/createUser',userController.CreateUser);
router.post('/getParticularUser',userController.getParticularUser);
router.get('/getAllUsers',userController.getAllUsers);
router.get('/getUser',userMiddleware,userController.getUser);
router.post('/set-password',userController.set_password);

router.get("/google",
    passport.authenticate("google",{scope : ["profile","email"]})
);

router.get("/google/callback",
    passport.authenticate("google",{session : false}),
    (req, res) => {
        const token = req.user.token;

        const hasPassword = !!req.user.password; // Check dynamically

        if (!hasPassword) {
            // Redirect user to set password page if they don't have one
            return res.redirect(`http://localhost:5173/set-password?email=${req.user.email}`);
        }

        res.redirect(`http://localhost:5173/dashboard?token=${token}`);
    }
)


module.exports = router;
