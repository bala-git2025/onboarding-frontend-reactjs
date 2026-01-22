import axios from "axios";

const API = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
});

// Attach token if available
API.interceptors.request.use((req) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Centralized error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        error.customMessage = "Invalid username or password";
      } else if (status >= 500) {
        error.customMessage = "Server error. Please try again later.";
      } else {
        error.customMessage =
          error.response.data?.message || "An unexpected error occurred";
      }
    } else if (error.request) {
      error.customMessage =
        "No response from server. Please check your connection.";
    } else {
      error.customMessage = "Unexpected error occurred. Please try again.";
    }

    return Promise.reject(error);
  }
);

export default API;