// // src/api/axiosConfig.js
// import axios from "axios";

// const instance = axios.create({
//   baseURL: "http://localhost:3000",
//   timeout: 30000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ✅ Always attach token before every request
// instance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken"); // same key you use at login
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default instance;
// src/api/axiosConfig.ts
// src/api/axiosConfig.ts
// src/api/axiosConfig.ts
import axios, { InternalAxiosRequestConfig } from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token before every request
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Ensure headers exist and cast to AxiosRequestHeaders
      config.headers = config.headers || {} as any;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
instance.interceptors.response.use(
  (response) => response, // normal response
  (error) => {
    // 🔥 AUTO LOGOUT
    if (error.response?.status === 401) {
      console.warn("Token expired or unauthorized → auto logout");
      localStorage.removeItem("token"); // remove token
      window.location.href = "/login";  // redirect to login page
    }
    return Promise.reject(error);
  })

export default instance;
