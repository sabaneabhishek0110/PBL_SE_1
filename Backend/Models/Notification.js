const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    type:{
        type:String,
        enum:["team_request","task assignment","task_update","general"],
        required:true
    },
    message : {
        type : String,
        required : true
    },
    requestedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        defualt : null
    },
    relatedTeam : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Team",
        defualt  : null
    },
    relatedTask : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Task",
        defualt  : null
    },
    isRead:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Notification = mongoose.model("Notification",notificationSchema);
module.exports = Notification;