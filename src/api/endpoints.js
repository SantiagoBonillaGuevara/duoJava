import api from "./axios";

export const getLevels = () => api.get("/levels");
export const getMyProfile = () => api.get("/users/me");
export const isUsernameAvailable = (username) =>
  api.get(`/users/username-available?username=${username}`);
export const getCurrentCourse = () => api.get("/courses/current");
export const getCoursesProgress = () => api.get("/courses/progress");
export const getLeaderboard = () => api.get("/leaderboard");
export const updateProfile = (profileData) => api.patch("/users/me", profileData);
