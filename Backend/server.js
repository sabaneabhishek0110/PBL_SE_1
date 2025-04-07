const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const userRoutes = require('./Routes/userRoutes');
const taskRoutes = require('./Routes/tasksRoutes');
const dashBoardRoutes = require('./Routes/DashboardRoutes');
const profileRoutes = require('./Routes/profileRoutes');
const notificationRoutes = require('./Routes/notificationRoutes');
const yourTeamRoutes = require('./Routes/yourTeamRoutes');
const yourDocumentsRoutes = require('./Routes/yourDocumentsRoutes');
const socketRoutes = require('./Routes/socketRoutes');
const Socket = require('socket.io')

const http = require('http');
require("dotenv").config();
require("./config/passportConfig");

const app = express();

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());
app.use(passport.initialize());

mongoose.connect("mongodb://localhost:27017/db").then(()=>{
    console.log("Connected to MongoDB")
}).catch((error)=>{
    console.log("Error connecting to MongoDB:", error);
})

app.use('/api/users',userRoutes);
app.use('/api/tasks',taskRoutes);
app.use('/api/dashboard', dashBoardRoutes);
app.use('/api/profile',profileRoutes);
app.use('/api/notification',notificationRoutes);
app.use('/api/yourTeams',yourTeamRoutes);
app.use('/api/yourDocuments',yourDocumentsRoutes);


const server = http.createServer(app);

const io = Socket(server,{
    cors : {
        origin: "http://localhost:5173", 
        methods: ["GET", "POST"],
        credentials: true,
    }
})

io.on('connection',socketRoutes);

server.listen(5000,()=>{
    console.log("Listening port no 5000...")
})