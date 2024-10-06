// apiServices.js
import axios from "axios";
import router from "@/router";

// Function to make GET requests
export const get = async (url) => {
  const config = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      "Access-Control-Allow-Origin": "*",
    },
  };
  try {
    const response = await axios.get(url, config);
    return response;
  } catch (error) {
    if (error.response.status === 401) {
      localStorage.clear();
      sessionStorage.clear();
      router.push({ name: "auth-login" });
    }
    throw error.response;
  }
};

// Function to make POST requests
export const post = async (url, body) => {
  const config = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      "Access-Control-Allow-Origin": "*",
    },
  };
  try {
    const response = await axios.post(url, body, config);
    return response;
  } catch (error) {
    if (error.response.status === 401) {
      localStorage.clear();
      sessionStorage.clear();
      router.push({ name: "auth-login" });
    }
    throw error.response;
  }
};

// Add more functions for other HTTP methods (PUT, DELETE, etc.) if needed
