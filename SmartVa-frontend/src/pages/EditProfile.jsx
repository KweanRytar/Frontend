import React, { useEffect, useState } from "react";
import { Meta, useNavigate } from "react-router";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const EditProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /* =======================
     FETCH USER PROFILE
  ======================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/user/getUser`,
          { withCredentials: true }
        );

        setFormData({
          fullName: res?.data?.user?.fullName || "",
          userName: res?.data?.user?.userName || "",
          email: res?.data?.user?.email || "",
          password: ""
        });
      } catch (error) {
        setMessage("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  /* =======================
     INPUT HANDLER
  ======================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* =======================
     TOGGLE PASSWORD VIEW
  ======================= */
  const togglePasswordVisibility = () => {
    setPasswordType((prev) =>
      prev === "password" ? "text" : "password"
    );
  };

  /* =======================
     SUBMIT HANDLER
  ======================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        fullName: formData.fullName,
        userName: formData.userName,
        email: formData.email,
        ...(showPassword &&
          formData.password && { password: formData.password })
      };

      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/user/updateUser`,
        payload,
        { withCredentials: true }
      );

      setMessage(res.data.message || "Profile updated successfully");

      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-green-500">
          Edit Profile
        </h2>

        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-blue-500 px-4 py-2 text-white rounded-xl"
        >
          Back
        </button>

        {message && (
          <p
            className={`mb-4 text-sm text-center ${
              message.toLowerCase().includes("success")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

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

          {/* CHANGE PASSWORD TOGGLE */}
          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              id="changePassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="changePassword">
              Change password
            </label>
          </div>

          {showPassword && (
            <div className="relative">
              <input
                type={passwordType}
                name="password"
                placeholder="New Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded-md dark:bg-gray-600 pr-10"
              />

              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300"
              >
                {passwordType === "password" ? (
                  <FaEye />
                ) : (
                  <FaEyeSlash />
                )}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={
              loading ||
              (showPassword && !formData.password)
            }
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
