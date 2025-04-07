const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        default : "Researcher"
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    password: {
        type: String,
        default : null,
    },
    googleId:{
        type:String,
        unique:true,
        sparse: true
    },
    profilePicture: {
        type: String, 
        default: function () {
            return `https://api.dicebear.com/7.x/avataaars/svg?seed=${this._id}`;
        }
    },
    bio: {
        type: String,
        default : ""
    },
    researchFields: {
        type: [String]
    },
    role: {
        type: String,
        enum: ["Researcher", "GroupAdmin", "SuperAdmin"],
        default: "Researcher"
    },
    groups: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Group" 
    }],
    pendingRequests: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Group" 
    }], 
    assignedTasks: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Task" 
    }],
    workspaceAccess: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isDeleted : {
        type : Boolean,
        defualt : false,
    },
    deletedAt: { 
        type: Date, 
        default: null 
    }
});

//Encrypting the password before saving to database during sign up
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

//comparing the password with stored password 
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to retrieve user's full details like groups field contains object id that referes to document present in other collection to fetch that data and display here this function used 
UserSchema.methods.getFullUserDetails = async function () {
    try {
        const user = await this.populate([
            { path: "groups" },
            { path: "pendingRequests" },
            { path: "assignedTasks" }
        ]).execPopulate();  // Populating referenced data (groups, pending requests, and tasks)
        return user;
    } catch (error) {
        throw new Error("Error populating user data: " + error.message);
    }
};

const User = mongoose.model("User",UserSchema);
module.exports = User;
