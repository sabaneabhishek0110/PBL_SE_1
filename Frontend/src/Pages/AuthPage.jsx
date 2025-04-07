import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-hot-toast';

const AuthPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [name,setName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            handleGoogleResponse(token);
        }
    }, []);

    const handleLogin = async () => {
        try {
            console.log("Entered in handleLogin in AuthPage.jsx");
            if (!email || !password) {
                toast.error("Please enter email and password");
                return;
            }
            const response = await fetch("http://localhost:5000/api/users/getParticularUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            console.log(response);
            const data = await response.json();

            if(!data.token){
                console.log("Token is not created");
                return;
            }

            if (response.ok) {
                localStorage.setItem("token" , data.token );
                navigate("/dashboard");
                toast.success("You are logged in!");
                console.log("User Data : ", data);
            } else {
                toast.error(data.message);
            }
            console.log("Completed handlesignup successfully in AuthPage.jsx");
        } catch (error) {
            console.error("Error in logging in ", error);
        }
    };

    const handlesignup = async () => {
        try {
            console.log("Entered in handlesignup in AuthPage.jsx");
            const response = await fetch("http://localhost:5000/api/users/createUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({name, email, password}),
            })
            const data = await response.json();

            if(!data.token){
                console.log("Token is not created");
                return;
            }

            if (response.ok) {
                localStorage.setItem("token",data.token);
                navigate("/dashboard");
                alert("Sign up successful");
            } else {
                alert(data.error);
            }
            console.log("Completed handlesignup successfully in AuthPage.jsx")
        } catch (error) {
            console.error("Error in Signup ", error);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:5000/api/users/google";
    };
    

    const handleGoogleResponse = async (token) =>{
        if(token){
            localStorage.setItem("token",token);
            navigate('/dashboard');
        }
        else{
            console.error("Google Login Failed");
        }
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
        <div className={`relative w-[768px] min-h-[480px] bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-500 ${isSignUp ? "scale-105" : "scale-100"}`}>
            
            {/* Left Side - Sign In */}
            <div className={`absolute right-0 transform translate-y-1/8 flex flex-col justify-center items-center w-1/2 p-6 transition-transform duration-500 ${isSignUp ? "-translate-x-full opacity-0 " : "translate-x-0 opacity-100 z-10"} `}>
                <h2 className="text-3xl font-semibold text-gray-900 mb-2">Sign In</h2>
                {/* <div className="mt-4 w-full flex justify-center space-x-3">
                    <button className="border p-2 w-50 h-10 rounded-md cursor-pointer font-bold" onClick={handleGoogleLogin}>with Google</button>
                </div> */}

                <div className="mt-4 w-full flex justify-center">
                    <button 
                        className="flex items-center justify-center gap-2 px-4 w-52 h-12 rounded-md border  hover:scale-105 active:scale-100 "
                        onClick={handleGoogleLogin}
                    >
                       <img src="public/Images/search.png" alt="google_logo" className="w-5 h-5"/>
                        with Google
                    </button>
                </div>
                <p className="mt-2 text-gray-600">or use your email</p>
                <input type="email" placeholder="Email" onChange={(e)=>{setemail(e.target.value)}} className="mt-3 p-2 w-full border rounded" />
                <input type="password" placeholder="Password" onChange={(e)=>{setpassword(e.target.value)}} className="mt-2 p-2 w-full border rounded" />
                <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md w-full cursor-pointer" onClick={handleLogin}>Sign In</button>
            </div>

            {/* Right Side - Sign Up */}
            <div className={`absolute inset-0 flex flex-col justify-center items-center w-1/2 p-6 transition-transform duration-500 ${isSignUp ? "translate-x-0 opacity-100 z-10" : "translate-x-full opacity-0"}`}>
                <h2 className="text-3xl font-semibold text-gray-900">Sign Up</h2>
                <div className="mt-4 w-full flex justify-center space-x-3">
                <div className="mt-4 w-full flex justify-center">
                    <button 
                        className="flex items-center justify-center gap-2 px-4 w-52 h-12 rounded-md border  hover:scale-105 active:scale-100 "
                        onClick={handleGoogleLogin}
                    >
                       <img src="public/Images/search.png" alt="google_logo" className="w-5 h-5"/>
                        with Google
                    </button>
                </div>
                </div>
                <p className="mt-2 text-gray-600">or use your email</p>
                <input type="text" placeholder="Name" onChange={(e)=>{setName(e.target.value)}} className="mt-3 p-2 w-full border rounded" />
                <input type="email" placeholder="Email" onChange={(e)=>{setemail(e.target.value)}} className="mt-2 p-2 w-full border rounded" />
                <input type="password" placeholder="Password" onChange={(e)=>{setpassword(e.target.value)}} className="mt-2 p-2 w-full border rounded" />
                <button className="mt-4 px-6 py-2 bg-green-500 text-white rounded-md w-full cursor-pointer" onClick={handlesignup}>Sign Up</button>
            </div>

            {/* Toggle Panel */}
            <div className={`absolute inset-y-0 right-0 w-1/2 flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white transition-transform duration-500 ${isSignUp ? "translate-x-0" : "-translate-x-full"}`}>
            <h2 className="text-2xl font-semibold">{isSignUp ? "Hello, Friend!" : "Welcome Back!"}</h2>
            <p className="mt-2 w-3/4 text-center">{isSignUp ? "Register now and explore amazing features!" : "Sign in to continue where you left off."}</p>
            <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="mt-6 px-6 py-2 border border-white rounded-md hover:bg-white hover:text-blue-600 transition cursor-pointer"
            >
                {isSignUp ? "Sign In" : "Sign Up"}
            </button>
            </div>
        </div>
        </div>

    );
};

export default AuthPage;




