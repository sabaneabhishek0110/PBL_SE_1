import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup_Login() {
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log(email, password);
        try {
            const response = await fetch("http://localhost:5000/api/users/getUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token" , data.token );
                navigate("/Dashboard1");
                alert("Login Successful!!");
                console.log("User Data : ", data);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error in logging in ", error);
        }
    };

    const handlesignup = async (e) => {
        e.preventDefault();
        console.log(email, password);
        try {
            const response = await fetch("http://localhost:5000/api/users/createUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password}),
            })
            const data = await response.json();

            if (response.ok) {
                navigate("/Dashboard1");
                alert("Sign up successful");
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error("Error in Sign up ", error);
        }
    };

    const [cardStyle, setcardStyle] = useState("");
    const [textStyle, settextStyle] = useState("");
    const [changed, setChanged] = useState(false);

    const Login = () => {
        setcardStyle("translate-x-[110%] duration-500");
        settextStyle("-translate-x-[125%] duration-500");
        setChanged((prev) => !prev);
    };

    const Signup = () => {
        setcardStyle("-translate-x-[0%] duration-500");
        settextStyle("translate-x-[0%] duration-500");
        setChanged((prev) => !prev);
    };

    return (
        <div className='flex w-1/2 h-96 justify-center items-center text-white justify-self-center'>
            <div style={{ backgroundColor: "rgb(22, 66, 120)" }} className='w-full h-4/5 flex flex-row items-center rounded-md'>
                
                <div className={`w-1/2 h-[115%] bg-blue-600 m-7 flex flex-col justify-evenly items-center rounded-md ${cardStyle}`}>
                    <form className='w-4/5 h-[70%] flex flex-col justify-evenly items-center m-10' onSubmit={changed ? handleLogin : handlesignup}>
                        
                        <div className='relative w-full flex flex-col items-center'>
                            <input type="text" id="Username" name='Email' onChange={(e) => { setemail(e.target.value); }} className='w-[85%] h-8 rounded-md bg-transparent border border-white focus:outline-none focus:ring-2 focus:ring-blue-500 peer text-left pl-2' />
                            <label htmlFor="Username" className={`absolute bg-blue-600 px-1 ml-1 transition-all duration-300 left-4 ${email ? 'top-[-10px] text-xs' : 'top-1/2 transform -translate-y-1/2 text-lg'}`}>Email or Phone</label>
                        </div>

                        <div className='relative w-full flex flex-col items-center'>
                            <input type="password" id="Password" name='Password' onChange={(e) => { setpassword(e.target.value); }} className='w-[85%] h-8 rounded-md bg-transparent border border-white focus:outline-none focus:ring-2 focus:ring-blue-500 peer text-left pl-2' />
                            <label htmlFor="Password" className={`absolute bg-blue-600 px-1 ml-1 transition-all duration-300 left-4 ${password ? 'top-[-10px] text-xs' : 'top-1/2 transform -translate-y-1/2 text-lg'}`}>Password</label>
                        </div>

                        {!changed && (
                            <div className='relative w-full flex flex-col items-center'>
                                <input type="password" id="Confirm_Password" name='confirmPassword' onChange={(e) => { setconfirmPassword(e.target.value); }} className='w-[85%] h-8 rounded-md bg-transparent border border-white focus:outline-none focus:ring-2 focus:ring-blue-500 peer text-left pl-2' />
                                <label htmlFor="Confirm_Password" className={`absolute bg-blue-600 px-1 ml-2 transition-all duration-300 left-4 ${confirmPassword ? 'top-[-10px] text-xs' : 'top-1/2 transform -translate-y-1/2 text-lg'}`}>Confirm Password</label>
                            </div>
                        )}

                        <button type='submit' className='w-[85%] h-[15%] bg-blue-500 rounded-md cursor-pointer text-center'>{changed ? "Sign In" : "Sign Up"}</button>
                    </form>
                </div>

                <div className={`w-[45%] h-[70%] m-7 flex flex-col justify-start items-start ${textStyle}`}>
                    {changed ? (
                        <>
                            <p className='text-2xl my-1 '>Do you have an account?</p>
                            <p className='text-xl my-1'>Create Now</p>
                            <button className='w-20 h-8 border-2 border-white rounded-md my-3 cursor-pointer' onClick={Signup}>Sign Up</button>
                        </>
                    ) : (
                        <>
                            <p className='text-3xl my-1 text-center'>Have an account?</p>
                            <p className='text-xl my-1 text-center'>Login to see.</p>
                            <button className='w-20 h-8 border-2 border-white rounded-md my-3 cursor-pointer' onClick={Login}>Login</button>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}

export default Signup_Login;
