import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Step 1: Request reset email
  const requestReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/request-reset-password`, { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error requesting reset");
    }
  };

  // Step 2: Confirm token (backend sets cookie if valid)
  const confirmToken = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${VITE_API_BASE_URL}/user/confirm-reset-token`,
        { token },
        { withCredentials: true }
      );
      setMessage(res.data.message);
      setStep(3);
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid or expired token");
    }
  };

  // Step 3: Reset password (backend reads token from cookie)
  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/reset-password`,
        { newPassword },
        { withCredentials: true }
      );
      setMessage(res.data.message);

      // Clear state
      setStep(1);
      setEmail(""); 
      setToken(""); 
      setNewPassword("");

      // Redirect after short delay
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-green-500">Reset Password</h2>
        {message && <p className="mb-4 text-sm text-red-500">{message}</p>}

        {step === 1 && (
          <form onSubmit={requestReset} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded-md dark:bg-gray-600"
            />
            <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600">
              Request Reset
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={confirmToken} className="space-y-4">
            <input
              type="text"
              placeholder="Enter reset token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              className="w-full p-2 border rounded-md dark:bg-gray-600"
            />
            <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600">
              Confirm Token
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={resetPassword} className="space-y-4">
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-2 border rounded-md dark:bg-gray-600"
            />
            <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600">
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
