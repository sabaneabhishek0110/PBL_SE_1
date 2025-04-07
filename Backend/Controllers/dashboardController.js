const Team = require('../Models/Team');


exports.CreateTeam = async (req,res) =>{
    try{
        console.log("Entered into CreateTeam in DashBoardController");

        const {Team_name,members,description} = req.body;
        const adminId = req.user?.userId;
        
        if (!Team_name || !adminId) {
            return res.status(400).json({ message: "Team name and Admin are required!" });
        }
        
        const newTeam = new Team({
            Team_name,
            description,
            Admin : adminId,
            members : [adminId,...members],
            accessControl : {userId : adminId,accessLevel :  "admin"}
        })
        await newTeam.save();
        console.log("Completed CreateTeam successfully in DashBoardController");
        res.status(201).json({message : "Team get created Successfully",team : newTeam});
    }
    catch(error){
        res.status(500).json({message : "Failed to create team " , details : error.message});
    }
}


exports.getAllTeams = async (req,res) =>{
    try{
        console.log("Entered into getAllTeams into dashBoardController.js");
        const userId = req.user.userId;
        console.log(req.user);
        if(!userId){
            res.status(500).json({message : "User Not found in getAllTeams"})
        }
        const teams = await Team.find({members : {$nin : [userId]}},'Team_name description Admin members').populate('members','name email profilePicture').populate('Admin','name email profilePicture');
        console.log(teams);
        console.log("completed getAllTeams successfully in dashBoardController.js");
        res.status(200).json(teams);
    }
    catch(error){
        res.status(500).json({message : "failed to fetch teams from database."})
    }
}