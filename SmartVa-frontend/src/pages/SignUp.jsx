import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/user/register", formData);
      setMessage(res.data.message);

      if(res.status === 201){
    setTimeout(()=>{
      navigate('/verify-email')
    }, 2000)
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Error registering user");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-green-500">Register</h2>
        {message && <p className="mb-4 text-sm text-red-500">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md dark:bg-gray-600"
          />
          <input
            type="text"
            name="userName"
            placeholder="Username"
            value={formData.userName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md dark:bg-gray-600"
          />
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
            Register
          </button>
        </form>
        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-green-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
