const Tasks = require("../Models/Tasks");
const Notification = require("../Models/Notification");
const mongoose = require("mongoose");

exports.createTask = async (req, res) => {
    try {
        console.log("Entered createTask in taskController.js");

        const { title, description, startDate, deadline, stages, relatedTeam } = req.body;
        console.log("Request Body:", req.body);

        const userId = req.user.userId;

        // Validate required fields
        if (!title || !description || !deadline || !relatedTeam || !startDate || !stages) {
            return res.status(400).json({ message: "All fields are required, and at least one stage must be assigned." });
        }

        const formattedStartDate = new Date(startDate.split('-').reverse().join('-'));
        const formattedDeadline = new Date(deadline.split('-').reverse().join('-'));

        if (isNaN(formattedStartDate) || isNaN(formattedDeadline)) {
            return res.status(400).json({ message: "Invalid date format. Please use DD-MM-YYYY." });
        }

        const currentDate = new Date();
        const status = currentDate < formattedStartDate ? "upcoming" : "ongoing";

        const cleanedStages = stages.map(stage => ({
            no: stage.no,
            title: stage.title,
            members: stage.members.map(member => {
                const memberId = typeof member === "object" && member.value ? member.value : member;
                return mongoose.isValidObjectId(memberId) ? new mongoose.Types.ObjectId(memberId) : null;
            }).filter(member => member !== null) // Remove invalid members
        }));

        // Creating new Task
        const newTask = new Tasks({
            title : title,
            description : description,
            status : status,
            assignedBy: new mongoose.Types.ObjectId(userId), // Ensure assignedBy is an ObjectId
            stages: cleanedStages,
            relatedTeam: new mongoose.Types.ObjectId(relatedTeam),
            progress: 0,
            startDate: formattedStartDate,
            deadline: formattedDeadline
        });

        console.log("New Task Data:", newTask);

        // Save the task to DB
        const savedTask = await newTask.save();

        console.log("Task saved successfully:", savedTask);
        res.status(200).json({ message: "Task created successfully", task: savedTask });
    } catch (error) {
        console.error("Error in createTask:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getUserTask = async(req,res) =>{
    try{
        console.log("Entered in getUserTask in taskController.js");
        const {selectedTeam} = req.params;
        const userId = req.user.userId;
        const currentDate = new Date();

        const Ongoing = [];
        const Completed = [];
        const Upcoming = [];

        const tasks = await Tasks.find({"stages.members" : userId,relatedTeam : selectedTeam}).populate("stages.members").populate("assignedMembers","name").populate("assignedBy","name");

        tasks.forEach(task=>{
            if(task.progress==100){
                Completed.push(task);
            }
            else if(task.startDate>currentDate){
                Upcoming.push(task);
            }
            else if(task.startDate<=currentDate && (task.deadline>=currentDate || task.progress<100)){
                Ongoing.push(task);
            }
        })

        console.log("completed getUserTask successfully in taskController.js");
        res.status(200).json({Ongoing,Completed,Upcoming});

    }
    catch(error){
        res.status(500).json({error:error.message});
    }
}

exports.getAllTasks = async(req,res) =>{
    try{
        console.log("Entered in getAlltasks in taskController.js");
        const {selectedTeam} = req.params;
        console.log("selectedTeam : ",selectedTeam);
        const currentDate = new Date();

        const Ongoing = [];
        const Completed = [];
        const Upcoming = [];
        const tasks = await Tasks.find({ relatedTeam: selectedTeam })
            .populate({
                path: "stages.members",
                select: "name"
            })
            .populate("stages.members")
            .populate("assignedBy", "name") // Populate assignedBy field
            .populate("relatedTeam", "name"); // If needed, populate team name

        tasks.forEach(task=>{
            if(task.progress==100){
                Completed.push(task);
            }
            else if(task.startDate>currentDate){
                Upcoming.push(task);
            }
            else if(task.startDate<=currentDate && (task.deadline>=currentDate || task.progress<100)){
                Ongoing.push(task);
            }
        })
        console.log("completed getAllTasks successfully in taskController.js");
        res.status(200).json({Ongoing,Completed,Upcoming});
    }
    catch(error){
        console.error("Error in getAllTasks:", error);
        res.status(500).json({error:error.message});
    }
}

exports.updateTaskProgress = async (req,res) =>{
    try{
        console.log("Entered in updateTaskProgress in taskController.js");
        const userId = req.user.userId;
        const {task,stage} = req.body;

        const task1 = await Tasks.findOne({_id:task});
        if(!task1){
            return res.status(500).json({message:"Task not found!!"});
        }

        const existTask = await Tasks.findOne({_id : task,stages : stage});

        if(!existTask){
            return res.status(200).json({message:"You dont have access to update task"});
        }

        existTask.progress = Progress;

        if(task.progress===100){
            task.status="completed";
        }
        await task.save();
        console.log("completed updateTaskProgress successfully in taskController.js");
        res.status(200).json({message:"Task progress updated",task});
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
}

exports.deleteTask = async (req,res) =>{
    try{
        console.log("Entered in deleteTask in taskController.js");
        const userId = req.user.userId;
        const {task} = req.body;

        const task1 = await Tasks.findOne({_id:task});
        if(!task1){
            return res.status(500).json({message:"Task not found!!"});
        }
        if(userId!==task1.Admin._id){
            return res.status(500).json({message:"No access to delete task"});
        }

        task1.isDeleted = true;

        await task1.save();
        console.log("completed deleteTask successfully in taskController.js");
        res.status(200).json({message:"Task Deleted"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:error.message});
    }
}

exports.updateStage = async (req,res) =>{
    try{
        console.log("Entered in updateStage in taskController.js");
        const userId = req.user.userId;
        const {taskId,stageNo} = req.params;
        const {action,updateData} = req.body;

        const task1 = await Tasks.findOne({_id:taskId});
        if(!task1){
            return res.status(500).json({message:"Task not found!!"});
        }
        if(userId!==task1.Admin._id){
            return res.status(500).json({message:"No access to delete task"});
        }

        let stage = task1.stages.find(stage=>stage.no===stageNo);
        if(stageIndex===-1){
            return res.status(404).json({ message: "Stage not found" });
        }

        if(action=="delete"){
            task1.stages.filter(stage=>stage.no!==parseInt(stageNo))
        }
        else{
            Object.assign(stage,updateData);
        }

        await task1.save();
        console.log("completed updateStage successfully in taskController.js");
        res.status(200).json({message: action=="delete"?`stage deleted`:`task updated`,task1});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:error.message});
    }
}


