import axios from "axios";
// import { LOGIN_SUCCESS, SET_USER } from "./userTypes";

const api = axios.create({
  baseURL: "https://smartva-backend-file.onrender.com",
  withCredentials: true, // always send cookies/session
});



export const loginUser = async (
  formData,
  navigate,
  setMessage,
  setUserName,
  
) => {
  try {
    const res = await api.post("user/login", formData);
    setMessage(res.data.message);

    if (res.status === 200) {
   
    localStorage.setItem("isLoggedIn", "true");

    // Fetch user data
    const userRes = await api.get("/user/getUser", { withCredentials: true });
    setUserName(userRes.data.user.userName);

    // Navigate after 2s
    setTimeout(() => navigate("/"), 2000);
 

    return true; // indicate success
    }
    return false; // indicate failure
  } catch (error) {
    setMessage(error.response?.data?.message || "Error logging in");
    console.error("Login error:", error);
    return false; // indicate failure
  }
};


