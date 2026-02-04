import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/user/verify-email", { token }, { withCredentials: true });
      setMessage(res.data.message);

      // ✅ Redirect after short delay
      setTimeout(() => {
        navigate("/"); // or "/dashboard" if you prefer
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid or expired token");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-green-500">Verify Email</h2>
        {message && <p className="mb-4 text-sm text-red-500">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter verification token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            className="w-full p-2 border rounded-md dark:bg-gray-600"
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
          >
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
