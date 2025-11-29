import axios from "axios";

/**
 * Axios client with:
 *  - baseURL from Vite env (VITE_API_URL)
 *  - request interceptor to attach Bearer token (from localStorage)
 *  - response interceptor to handle 401 (auto-logout redirect)
 *
 * Usage:
 * import api from "src/services/api/axiosClient";
 * api.get("/tasks")    // calls http://.../api/tasks
 */

const API_BASE = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000, // 15s - adjust as needed
  headers: {
    "Content-Type": "application/json",
  },
});

/** Helper: clear auth and redirect to login */
function handleLogout() {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // if you store user data
  } catch (e) {
    // ignore
  }
  // Redirect to login - using location to avoid router dependency here
  window.location.href = "/login";
}

/** Request interceptor: attach token if present */
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      // fail silently — request will go without token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/** Response interceptor: centralize 401 handling */
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // If unauthorized, clear token and redirect to login
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return Promise.reject(error);
  }
);

/** Optional helpers exported for convenience */
export function setToken(token) {
  if (!token) return;
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export default api;
