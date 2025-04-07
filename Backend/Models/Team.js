const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    Team_name : {
        type : String,
        required : true
    },
    description : {
        type : String ,
    },
    members : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'User',
    },
    Admin : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    accessControl: [{ 
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        accessLevel:{ type : String, enum : ["read","write","admin"]} // "read", "write", "admin"
    }],
    isDeleted : {
        type : Boolean,
        defualt : false,
    },
    deletedAt: { 
        type: Date, 
        default: null 
    }
});

teamSchema.pre('save', function (next){
    if(!this.members.includes(this.admin)){
        this.members.push(this.admin);
    }
    next();
})

const Team = mongoose.model('Team',teamSchema);

module.exports = Team;