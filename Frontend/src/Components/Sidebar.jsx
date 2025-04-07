import React from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { UsersRound ,LogOut,User,Clipboard,MessageCircleIcon,FileText} from "lucide-react";
import toast from "react-hot-toast";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Profile", path: "/profile", icon: <User className="w-5 h-5"/> },
    { name: "Dashboard", path: "/dashboard", icon: "/Images/dashboard.png" },
    { name: "Your Teams", path: "/your_Teams", icon: <UsersRound className="w-5 h-5" /> },
    { name: "Tasks", path: "/to_Do_List", icon: <Clipboard className="w-5 h-5" /> },
    { name: "Chat", path: "/chat", icon: <MessageCircleIcon className="w-5 h-5"/> },
    { name: "Documents", path: "/your_documents", icon: <FileText className="w-5 h-5"/> },
  ];

  const navigate = useNavigate();

  const handleLogout = async() =>{
    try{
      localStorage.removeItem("token");
      navigate('/AuthPage');
      toast.success("Logout Successful...");
    }
    catch(error){
      console.log("Failed to log out",error.message);
    }
  }

  return (
    <div className="text-white flex h-screen w-full">
      <div className="rounded-lg bg-gray-900 w-full h-[95%] flex flex-col shadow-xl backdrop-blur-lg p-4">
        {/* Logo / Brand Name */}
        <div className="flex items-center justify-center my-3">
          <p className="text-xl font-bold">ResearcHub</p>
        </div>

        <hr className="my-2 text-gray-500" />

        {/* Sidebar Menu */}
        <nav className="flex flex-col space-y-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center space-x-2 p-3 rounded-md cursor-pointer transition-all ${
                location.pathname === item.path ? "bg-gray-600" : "hover:bg-gray-600 bg-transparent"
              }`}
            >
              {typeof item.icon === "string" ? (
                <img src={item.icon} alt={`${item.name} icon`} className="w-5 h-5" />
              ) : (
                item.icon
              )}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <hr className="my-3 text-gray-500" />

        <div className=" p-3 mb-4 hover:bg-gray-600 bg-transparent rounded-lg cursor-pointer">
          <button className="flex flex-row items-center space-x-2" onClick={handleLogout}>
            <LogOut className="icon w-5 h-5" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
