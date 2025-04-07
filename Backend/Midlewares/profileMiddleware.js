const express = require('express');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const profileMiddleware = (req,res,next) =>{
    try{
        console.log("Entered into profleMiddleware in profileMiddleware.js");
        const token = req.header("Authorization");
        console.log(token);
        if(!token || !token.startsWith("Bearer ") ){
            return res.sattus(401).json({message : "UnAuthorized : No token provided"});
        }

        const authToken = token.split(" ")[1];

        const decoded = jwt.verify(authToken,JWT_SECRET);

        if(!decoded.userId){
            return res.status(401).json({message : "Invalid token : userId is missing "});
        }

        req.user = decoded;

        console.log("user added to req");
        console.log("Completed successfully profileMiddleware in profileMiddleware.js");

        next();
    }
    catch(error){
        res.status(500).json({message : "Invalid token ", error});
    }

}

module.exports = profileMiddleware;