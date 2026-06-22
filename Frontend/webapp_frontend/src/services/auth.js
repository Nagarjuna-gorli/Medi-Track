import { login as loginAPI } from "./authServices";

export const loginUser = async (username, password) => {
  const res = await loginAPI(username, password);

  localStorage.setItem("access", res.data.access);
  localStorage.setItem("refresh", res.data.refresh);

  return res.data;
};

export const logoutUser = () => {
  localStorage.clear();
  window.location.href = "/";
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("access");
};

export const getRole = () => {
  return localStorage.getItem("role");
};