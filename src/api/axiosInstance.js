import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://ec2-13-201-98-117.ap-south-1.compute.amazonaws.com:3000",
});

// Automatically attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
