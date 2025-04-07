const Task = require('../Models/Tasks');
const Notification = require('../Models/Notification');


exports.getTaskNotification = async (req,res) =>{
    try{
        console.log("Entered in getTaskNotification in notificationController.js");
        const {userId} = req.params;
        const notifications = Notification.find({user:userId}).sort({createdAt:-1});
        
        console.log("Completed getTaskNotification successfully in notificationController.js");
        res.status(200).json(notifications);
    }
    catch(error){
        res.status(500).json({error : error.message});
    }
}


exports.updateNotificationStatus = async (req,res) =>{
    try{
        console.log("Entered in updateNotificationStatus in notificationController.js");
        const {notificationId} = req.params;
        await Notification.findByIdAndUpdate(notificationId,{status:"read"});
        console.log("Completed updateNotificationStatus successfully in notificationController.js");
        res.status(200).json({message:"Notification marked as read"});
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
}

exports.addToGroupRequest = async (req,res) =>{
    try{
        console.log("Entered in addToGroupRequest in NotificationController.js");
        const user_Id = req.user.userId;
        const {Admin,Team_Id} = req.body;

        const AddToGroup = new Notification({
            recipient : Admin,
            type : "team_request",
            requestedBy : user_Id,
            message : `User ${user_Id} requested to join team ${Team_Id}`,
            relatedTeam : Team_Id,
        })

        await AddToGroup.save();
        console.log("Completed addToGroupRequest in NotificationController.js Successfully");
        res.status(200).json({message : "Notification sent successfully"});
        
    }
    catch(error){
        res.status(500).json({message : "Failed to send request to join team " ,error})
    }
}

exports.getNotifications = async (req,res) =>{
    try{
        console.log("Entered into getNotifications in notificationController.js");
        const AdminId = req.user.userId;
        if(!AdminId){
            res.status(500).json("Invalid token format");
            return;
        }
        const notifications = await Notification.find({recipient:AdminId}).populate("requestedBy","name").populate("relatedTeam","Team_name").sort({createdAt:-1});
        console.log(notifications);
        console.log("completed getNotifications in notificationController.js");
        res.status(200).json(notifications);

    }
    catch(error){
        res.status(500).json("failed to fetch notifications");
    }
}