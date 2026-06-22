import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../css/Prescriptions.css";

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("prescriptions/");
      setPrescriptions(res.data);
    } catch (err) {
      console.log("Error loading prescriptions:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h3>Loading prescriptions...</h3>;

  return (
    <div className="prescription-container">
      <h2>My Prescriptions</h2>

      {prescriptions.length === 0 ? (
        <p>No prescriptions found</p>
      ) : (
        prescriptions.map((p) => (
          <div key={p.id} className="card">

            <h3>Dr. {p.doctor_name}</h3>

            <p>
              <b>Medicine:</b> {p.medicine}
            </p>

            <p>
              <b>Dosage:</b> {p.dosage}
            </p>
            
            <p>
              <b>Instructions:</b> {p.instructions || "N/A"}
            </p>

            <p>
              <b>Date:</b>{" "}
              {new Date(p.created_at).toLocaleString()}
            </p>

          </div>
        ))
      )}
    </div>
  );
}
