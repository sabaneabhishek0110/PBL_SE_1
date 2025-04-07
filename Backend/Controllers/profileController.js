const User = require('../Models/User');
const Team = require('../Models/Team');
const Notification = require("../Models/Notification");

exports.getParticularUser = async (req,res) =>{
    try{
        console.log("Entered into getParticularUser in profileController");
        
        const userId = req.user.userId;
        console.log(userId);
        if (!userId ) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const existUser = await User.findOne({_id : userId});
        console.log(existUser);
        if (!existUser) {
            return res.status(404).json({ message: "User not found" });
        } 
        const user = {
            name : existUser.name,
            email : existUser.email,
            profilePicture: existUser.profilePicture, 
            bio: existUser.bio, 
            researchFields: existUser.researchFields,
            role: existUser.role,
            groups : existUser.groups,
            pendingRequests : existUser.pendingRequests,
            assignedTasks : existUser.assignedTasks,
            workspaceAccess : existUser.workspaceAccess
        }
        console.log("getParticularUser ran successfully in profileController.js");
        res.status(200).json({message : "User data fetched successfully",user});

    }
    catch(error){
        res.status(500).json({message : "Internal Error", error});
    }
}

exports.giveAccess = async (req,res) =>{
    try{
        console.log("Entered into giveAccess into profileController.js");
        const {notification} = req.body;
        const {relatedTeam,_id,requestedBy} = notification;
        const team = await Team.findById(relatedTeam._id);
        if(!team){
            res.status(500).json("failed to find team");
        }
        if(!team.members.includes(requestedBy)){
            team.members.push(requestedBy);
            await team.save();
        }

        const exists = Notification.exists(_id);
        if(!exists){
            res.status(500).json({message : "failed to remove notification from Notification"});
        }
        const response = await Notification.deleteOne({_id : _id});
        console.log("Completed giveAccess into profileController.js");
        res.status(200).json({message : "access is given successfully"});
    }
    catch(error){
        res.status(500).json({message : "failed to give access",error : error.message});
    }
}