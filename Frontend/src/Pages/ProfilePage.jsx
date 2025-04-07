import React from 'react'
import {useState,useEffect} from 'react'
import { Pencil } from 'lucide-react';
import {motion} from 'framer-motion'

function ProfilePage() {
  const [user,setuser] = useState({
    name :"",
    email : "",
    profilePicture :"",
    bio : "",
    researchFields : "",
    role : "",
    groups : [],
    pendingRequests : [],
    assignedTasks : [],
    workspaceAccess : []
  })


  useEffect(()=>{
    fetchUser();
    fetchNotifications();
  },[]);
  
  const fetchUser = async () =>{
    try{
      const token = localStorage.getItem("token");
      console.log(token);
      if (!token) {
          console.error("No token found in localStorage");
          return;
      }

      const response = await fetch('http://localhost:5000/api/profile',{
        method : 'GET',
        headers : {
          'Content-Type' : 'application/json',
          "Authorization": `Bearer ${token}`,
        }
      })

      if(!response.ok){
        throw new Error("failed to fetch user details");
      }
      const data = await response.json() ;
      console.log(data.user);
      setuser(data.user);
      console.log("User data fetched in fetchUser in Frontend");
    }
    catch(error){
      console.error("failed to fetch user details",error);
    }
  }
  

  const fetchNotifications = async () =>{
    try{
      console.log("Entered into fetchNotifications in ProfilePage.jsx");
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/notification/getNotifications',{
        method : 'GET',
        headers : {
          'Content-Type' : 'application/json',
          "Authorization" : `Bearer ${token}`,
        }
      })

      if(!response.ok){
        throw new Error("failed to fetch notifications");
      }

      const data = await response.json();
      console.log(data);  
      setuser(prev =>({...prev,pendingRequests:data}));
      console.log("ended fetchNotifications in ProfilePage.jsx successfully");
    }
    catch(error){
      console.error("failed to fetch notifications");
    }
  }

  const giveAccess = async (_id) =>{
    try{
      const notification = user.pendingRequests.find(notification => notification._id===_id);
      if(!notification){
        console.log("failed to find Ntification in ProfilePage.jsx");
        return;
      }
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/profile/giveAccess",{
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json',
          "Authorization" : `Bearer ${token}`
        },
        body : JSON.stringify({notification})
      })

      if(!response.ok){
        console.log("failed to give access");
        return;
      }
      setuser(prev=>({
        ...prev,
        pendingRequests : prev.pendingRequests.filter(req => req._id != _id)
      }))
      console.log(`Access is given to ${notification.requestedBy}`);
    }
    catch(error){
      console.log("Failed to give access",error);
    }
  }
  return (
    <motion.div className="flex w-full h-screen bg-gray-900 p-6" initial = {{opacity : 0,y:-20}} animate={{opacity : 1,y : 0}} transition={{duration : 0.4}} >
      {/* Profile Sidebar */}
      {/* <div className="w-1/4 h-full bg-gray-800 text-white rounded-xl p-6 shadow-lg">
        <Pencil className='taxt-gray-500'/>
        <div className="flex flex-col items-center space-y-4">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-[#38BDF8]"
          />
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-400">{user.bio || 'No bio available'}</p>
          <p className="text-sm bg-[#334155] p-2 rounded-md">Role: {user.role}</p>
          <p className="text-sm bg-[#334155] p-2 rounded-md">Field: {user.researchFields}</p>
        </div>
      </div> */}



      <div className="w-1/4 h-full bg-gray-800 text-white rounded-xl p-6 shadow-lg flex flex-col items-center space-y-4">
        {/* Edit Icon */}
        <div className="self-end cursor-pointer">
          <Pencil className="text-gray-500 hover:text-gray-300 transition duration-200" />
        </div>

        {/* Profile Section */}
        <img
          src={user?.profilePicture || "/default-profile.png"} 
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-[#38BDF8] object-cover"
        />
        
        <h2 className="text-xl font-semibold text-center">{user?.name || "Unknown User"}</h2>
        <p className="text-sm text-gray-400 text-center">{user?.bio || "No bio available"}</p>
        
        {/* Role & Research Field */}
        <p className="text-sm bg-[#334155] px-4 py-2 rounded-md text-center">
          <strong>Role:</strong> {user?.role || "Not specified"}
        </p>

        <p className="text-sm bg-[#334155] px-4 py-2 rounded-md text-center">
          <strong>Field:</strong> {user?.researchFields || "Not specified"}
        </p>
      </div>


      {/* Main Content */}
      <div className="w-3/4 h-full flex flex-col space-y-4 pl-6">
        {/* Research Groups */}
        <div className="bg-[#1E1E2E] text-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-[#38BDF8] mb-4">Research Groups</h3>
          <ul className="list-disc list-inside space-y-2">
            {user.groups.length > 0 ? (
              user.groups.map((group, index) => (
                <li key={index} className="bg-[#334155] p-2 rounded-md">{group}</li>
              ))
            ) : (
              <p className="text-gray-400">No groups joined yet.</p>
            )}
          </ul>
        </div>

        {/* Two-column Layout for Tasks & Requests */}
        <div className="grid grid-cols-2 gap-4">
          {/* Pending Requests */}
          <div className="bg-[#1E1E2E] text-white rounded-xl p-4 shadow-lg">
            <h3 className="text-lg font-semibold text-[#38BDF8] mb-2">Pending Requests</h3>
            <ul className="list-disc list-inside space-y-2">
              {user.pendingRequests.length > 0 ? (
                user.pendingRequests.map((notification, index) => (
                  <div
                    key={index}
                    className="bg-[#334155] p-3 rounded-md flex justify-between items-center"
                  >
                    <p>
                      <strong>{notification.requestedBy.name}</strong> wants to join{' '}
                      <strong>{notification.relatedTeam.Team_name}</strong>
                    </p>
                    <button
                      className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition"
                      onClick={() => giveAccess(notification._id)}
                    >
                      Accept
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No pending requests.</p>
              )}
            </ul>
          </div>

          {/* Research Progress */}
          <div className="bg-[#1E1E2E] text-white rounded-xl p-4 shadow-lg">
            <h3 className="text-lg font-semibold text-[#38BDF8] mb-2">Research Progress</h3>
            <p className="text-sm text-gray-400">
              Completed: {user.researchCompleted} | Ongoing: {user.researchOngoing} | Upcoming: {user.researchUpcoming}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProfilePage