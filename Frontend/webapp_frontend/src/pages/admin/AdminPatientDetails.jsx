import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import "../../css/AdminPatientDetails.css"

export default function AdminPatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    fetchPatient();
  }, []);

  const fetchPatient = async () => {
    try {
      const res = await api.get(`patients/${id}/`);
      setPatient(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!patient) return <h3>Loading...</h3>;

  return (
    <div className="details-container">
      <h2>Patient Details</h2>

      <p><b>ID:</b> {patient.id}</p>
      <p><b>Username:</b> {patient.username}</p>
      <p><b>Email:</b> {patient.email}</p>
      <p><b>Age:</b> {patient.age}</p>
      <p><b>Phone:</b> {patient.phone}</p>
      <p><b>Gender:</b> {patient.gender}</p>
      <p><b>Blood Group:</b> {patient.blood_group}</p>
      <p><b>Address:</b> {patient.address}</p>
    </div>
  );
}