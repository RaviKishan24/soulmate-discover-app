import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("coyToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("coyToken");
      localStorage.removeItem("coyUser");
    }
    return Promise.reject(err);
  }
);

export const getFeed = () => api.get("/feed").then((r) => r.data);
export const postSwipe = (targetUserId, action) =>
  api.post("/swipe", { targetUserId, action }).then((r) => r.data);
export const getMatches = () => api.get("/matches").then((r) => r.data);
export const markMatchesSeen = () => api.put("/matches/mark-seen").then((r) => r.data);

export default api;