import api from "./api";

export const login = (username, password) => {
  return api.post("token/", { username, password });
};

export const register = (data) => {
  return api.post("accounts/register/", data);
};