const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require("jsonwebtoken");
const User = require('../Models/User');
require('dotenv').config();
const mongoose = require("mongoose");

passport.use(
    new GoogleStrategy({
        clientID : process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL : "http://localhost:5000/api/users/google/callback"
    },
    async (accessToken,refreshToken,profile,done) =>{
        console.log("Entered in passport in passportConfig ...");
        try{
            let user = await User.findOne({googleId : profile.id});

            
            if (!user) {
                // Check if a user with the same email exists (registered via email/password)
                user = await User.findOne({ email: profile.emails?.[0]?.value });

                if (user) {
                    // Update existing user to link Google ID
                    user.googleId = profile.id;

                    await user.save();
                } else {
                    // Create a new user
                    user = new User({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails?.[0]?.value || "",
                        profilePicture : `https://api.dicebear.com/7.x/avataaars/svg?seed=${new mongoose.Types.ObjectId()}`,
                    });
                    await user.save();

                }
            }

            const token = jwt.sign({userId : user._id},process.env.JWT_SECRET,{expiresIn:"10h"});

            user = user.toObject(); 
            user.token = token;     
            
            return done(null,user);
        }
        catch(error){
            return done(error,null);
        }
    }
    )
)