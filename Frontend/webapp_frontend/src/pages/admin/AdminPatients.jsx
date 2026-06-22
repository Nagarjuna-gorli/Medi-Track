import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../css/AdminPatients.css";

export default function AdminPatients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await api.get("patients/");
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deletePatient = async (id) => {
    if (!window.confirm("Delete this patient permanently?"))
      return;

    try {
      await api.delete(`patients/${id}/`);

      setPatients((prev) =>
        prev.filter((p) => p.id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete patient");
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.username
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      patient.email
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  if (loading) {
    return <h2>Loading Patients...</h2>;
  }

  return (
    <div className="admin-patients-container">
      <h2>Manage Patients</h2>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search patient..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      <div className="table-wrapper">
        <table className="patient-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Blood Group</th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{patient.username}</td>
                <td>{patient.age}</td>
                <td>{patient.phone}</td>
                <td>{patient.gender}</td>
                <td>{patient.blood_group}</td>

                <td>
                <button
                  className="view-btn"
                  onClick={() => navigate(`/admin/patients/${patient.id}`)}
                >
                  View
                </button>
                  <button
                    className="delete-btn"
                    onClick={() =>
                      deletePatient(patient.id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}