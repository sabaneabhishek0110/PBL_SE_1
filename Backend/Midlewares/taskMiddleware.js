const express = require("express");
const jwt = require('jsonwebtoken');
const User = require("../Models/User"); 

const JWT_SECRET = process.env.JWT_SECRET; 

const authMiddleware = async (req,res,next)=>{
    const token = req.header("Authorization");
    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    const authToken = token.split(" ")[1];
    console.log("Extracted Token:", authToken);
    try{
        console.log("Entered into taskMiddle in taskMiddleware.js");

        const decoded = jwt.verify(authToken,JWT_SECRET);
        console.log("Decoded token : ",decoded);

        if (!decoded.userId) {
            return res.status(400).json({ message: "Invalid token: userId missing" });
        }

        req.user=decoded;

        console.log("completed taskMiddleware in taskMiddleware.js");
        next();
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}

module.exports = authMiddleware;