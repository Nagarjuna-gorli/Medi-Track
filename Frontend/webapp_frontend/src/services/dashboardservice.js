import api from "./api";

export const getAdminDashboard = async () => {
  const res = await api.get("dashboard/admin/");
  return res.data;
};

export const getDoctorDashboard = async () => {
  const res = await api.get("dashboard/doctor/");
  return res.data;
};

export const getPatientDashboard = async () => {
  const res = await api.get("dashboard/patient/");
  return res.data;
};