import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../css/PatientReports.css";

export default function PatientReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api.get("reports/")
      .then(res => setReports(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="report-container">

      <div className="back-container">
      <FaArrowLeft
      className="back-arrow"
      onClick={() => navigate("/patient")}
      />
     </div>

      <h2>My Medical Reports</h2>

      {reports.length === 0 ? (
        <p>No reports found</p>
      ) : (
        reports.map((r) => (
          <div key={r.id} className="card">
            <h3>{r.title}</h3>

            <p><b>Doctor:</b> Dr. {r.doctor_name}</p>
            <p><b>Description:</b> {r.description}</p>

            {r.file && (
              <a href={r.file} target="_blank" rel="noreferrer">
                View Report
              </a>
            )}

            <p>{new Date(r.created_at).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}
