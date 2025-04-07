const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ["ongoing", "completed", "upcoming"],
        default: "upcoming"
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    stages: [{
        no: {
            type: Number,
            required: true
        },
        title: {
            type: String,  // Removed unnecessary quotes around String
            required: true
        },
        members: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        attachedDocuments: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Document" 
        }],
        status: { 
            type: String, 
            enum: ["Pending", "Approved", "Declined"], 
            default: "Pending" 
        },
        updates: [
            {
              updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
              updatedAt: { type: Date, default: Date.now },
              comments: String,
              attachment: String // File URL for document attachment
            }
          ]
    }], // Directly defining stages inside TaskSchema

    relatedTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    },
    progress: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date
    },
    deadline: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    notifications: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Notification" 
    }],
    isDeleted : {
        type : Boolean,
        default : false,
    }
},
{ timestamps: true });

TaskSchema.index({ assignedMembers: 1 });

const Task = mongoose.model("Task", TaskSchema, "task");
module.exports = Task;
