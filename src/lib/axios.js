import axios from "axios";

// ✅ Ensure no trailing slash bugs and always send cookies
const base = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

export const axiosInstance = axios.create({
  baseURL: base,          // set this env to: https://connectlinkbackend.onrender.com/api/v1
  withCredentials: true,  // send the auth cookie on every request
});
