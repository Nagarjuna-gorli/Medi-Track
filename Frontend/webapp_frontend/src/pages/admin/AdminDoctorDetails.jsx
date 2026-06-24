import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../css/AdminDoctorDetails.css"

export default function AdminDoctorDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    fetchDoctor();
  }, []);

  const fetchDoctor = async () => {
    try {
      const res = await api.get(`doctors/${id}/`);
      setDoctor(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!doctor) return <h3>Loading...</h3>;

  return (
    <div className="details-container">
      <div className="back-container">
          <FaArrowLeft
            className="back-arrow"
            onClick={() => navigate("/admin/doctors")}
          />
        </div>
      <h2>Doctor Details</h2>

      <p><b>Username:</b> {doctor.username}</p>
      <p><b>Email:</b> {doctor.email}</p>
      <p><b>Specialization:</b> {doctor.specialization}</p>
      <p><b>Phone:</b> {doctor.phone}</p>
      <p><b>Hospital:</b> {doctor.hospital_name}</p>
      <p><b>Experience:</b> {doctor.experience}</p>
      <p><b>Status:</b> {doctor.is_active ? "Active" : "Disabled"}</p>
    </div>
  );
}