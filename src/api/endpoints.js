import api from "./axios";

export const getLevels = () => api.get("/levels");
export const getMyProfile = () => api.get("/users/me");
export const isUsernameAvailable = (username) =>
  api.get(`/users/username-available?username=${username}`);
