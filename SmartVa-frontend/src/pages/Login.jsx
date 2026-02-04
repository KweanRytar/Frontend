import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { loginUser } from "../redux/user/userActions";
import { useGetUserInfoQuery } from "../redux/dashboard/OverviewSlice";


import { loginUser } from "../../API_Calls/dashboardData";



const Login = () => {



  const navigate = useNavigate();
 
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [login, setLogin] = useState(false);
 


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const success = await loginUser(
    formData,
    navigate,
    setMessage,
    setUserName,
     // from App.jsx via props
  );

  if (success) {
     
    localStorage.setItem("isLoggedIn", "true");
   
    setLogin(true)
    // local UI effect only
    
  } else {
    setLogin(false)
    localStorage.setItem("isLoggedIn", "false");
  }
};



  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-green-500">Login</h2>
        {message && <p className={login ? 'text-green-500 mb-6 text-sm': 'mb-4 text-sm text-red-500'}>{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md dark:bg-gray-600"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md dark:bg-gray-600"
          />
          <button
          
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
            
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-sm">
          <Link to="/reset-password" className="text-green-500 hover:underline">
            Forgot Password?
          </Link>
        </div>
        <p className="mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-green-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
      {}
    </div>
  );
};

export default Login;
