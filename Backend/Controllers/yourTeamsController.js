const Team = require("../Models/Team");
const Tasks = require('../Models/Tasks');

exports.getAllTeams = async (req,res) =>{
    try{
        console.log("Enterd into getAllTeams in yourTeamsController.js");
        const userId = req.user.userId;
        if(!userId){
            res.status(500).json({message : "User Not found in getAllTeams"})
        }
        const teams = await Team.find({
            $or : [
                {members : {$in : [userId]}},
                {Admin : {$in : [userId]}}
            ]
        },'Team_name description Admin members').populate('members','name email profilePicture').populate('Admin','name email profilePicture');
        console.log("Completed getAllTeams in yourTeamsController.js");
        res.status(200).json(teams);
    }
    catch(error){
        res.status(500).json({message : "failed to fetch teams from database."})
    }
}

exports.getParticularTeam = async (req,res) =>{
    try{
        console.log("Entered into geParticularTeam in yourTeamsController.js");
        const {teamId} = req.params;

        const team = await Team.findOne({_id : teamId},'Team_name description Admin members').populate('members','name email profilePicture').populate('Admin','name email profilePicture');
        const completedTasks = await Tasks.find({
            $and : [
                {relatedTeam : teamId},
                {status : "completed"}
            ]
        },'title assignedMembers').populate('assignedMembers','name email profilePicture');
        if(!completedTasks){
            completedTasks = [];
        }
        console.log("Completed getParticularTeam in yourTeamsController.js");
        res.status(200).json({team,completedTasks});
    }
    catch(error){
        res.status(500).json({message : "failed to fetch team from database."})
    }
}

exports.CompareIsAdminOrNot = async (req,res) =>{
    try{
        console.log("Entered into CompareIsAdminOrNot in yourTeamsController.js");
        const {adminId} = req.params;
        const userId = req.user.userId;
        console.log("adminId : " ,adminId);
        console.log("userId : " ,userId);
        const isAdmin = (userId===adminId?true:false);
        console.log(isAdmin);
        console.log("Completed CompareIsAdminOrNot in yourTeamsController.js");
        res.status(200).json(isAdmin);
    }
    catch(error){
        res.status(500).json({message : "failed to fetch team from database."})
    }
}