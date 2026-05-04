import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:5000"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  console.log("🔥 TOKEN SENT:", token);

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;