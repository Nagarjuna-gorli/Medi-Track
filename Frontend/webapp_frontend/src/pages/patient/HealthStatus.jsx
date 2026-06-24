import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../css/HealthStatus.css";

export default function HealthStatus() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const fetchHealthStatus = async () => {
    try {
      const res = await api.get("healthstatus/");
      setData(res.data);
    } catch (err) {
      console.log("Error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchHealthStatus();
  }, []);

  if (!data.length) return <h3>No health records found...</h3>;

  return (
    <div className="health-container">

      <div className="back-container">
      <FaArrowLeft
      className="back-arrow"
      onClick={() => navigate("/patient")}
      />
     </div>

      <h2>My Health Status</h2>

      {data.map((item) => (
        <div className="health-card" key={item.id}>

          <p><b>Doctor:</b> {item.doctor_name}</p>

          <p><b>Blood Pressure:</b> {item.blood_pressure || "Not recorded"}</p>

          <p><b>Sugar Level:</b> {item.sugar_level || "Not recorded"}</p>

          <p><b>Status:</b> {item.status}</p>

          <p>
            <b>Last Updated:</b>{" "}
            {item.updated_at
              ? new Date(item.updated_at).toLocaleString()
              : "N/A"}
          </p>

        </div>
      ))}
    </div>
  );
}