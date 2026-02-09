import axios from "axios";

// import { LOGIN_SUCCESS, SET_USER } from "./userTypes";

 const getFullURL = (endpoint = '') => {
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
  
  // If no endpoint or it's just query params, don't add extra slash
  const cleanEndpoint = endpoint ? endpoint.replace(/^\/+/, '') : '';
  
  return new URL(cleanEndpoint, base).toString();
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ,
  withCredentials: true, // always send cookies/session
});



export const loginUser = async (
  formData,
  navigate,
  setMessage,
  setUserName,
  
) => {
  try {
    const res = await api.post(getFullURL('/user/login'), formData);
    setMessage(res.data.message);

    if (res.status === 200) {
   
    localStorage.setItem("isLoggedIn", "true");

    // Fetch user data
    const userRes = await api.get(getFullURL('/user/getUser'), { withCredentials: true });
    setUserName(userRes.data.user.userName);

    // Navigate after 2s
    setTimeout(() => navigate("/dashboard"), 2000);
 

    return true; // indicate success
    }
    return false; // indicate failure
  } catch (error) {
    setMessage(error.response?.data?.message || "Error logging in");
    console.error("Login error:", error);
    return false; // indicate failure
  }
};


