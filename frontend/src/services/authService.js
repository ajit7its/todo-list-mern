import api, { setToken, clearToken } from "./api/axiosClient";

/**
 * AuthService:
 * Handles: signup, login, logout
 * Saves token & user to localStorage
 * Uses the axiosClient (auto attaches token to requests)
 */

const AUTH_URL = "/auth";

export const signupUser = async (payload) => {
  const response = await api.post(`${AUTH_URL}/signup`, payload);

  // If signup returns a token, store it (optional)
  if (response.data?.token) {
    setToken(response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  return response.data;
};

export const loginUser = async (payload) => {
  const response = await api.post(`${AUTH_URL}/login`, payload);

  // Save token
  if (response.data?.token) {
    setToken(response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  return response.data;
};

export const logoutUser = () => {
  clearToken(); // Clears token + user from localStorage
  window.location.href = "/login"; // Redirect to login
};
