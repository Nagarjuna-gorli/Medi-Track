import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../css/MyPatients.css";

export default function DoctorPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await api.get("/patients/");
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter((p) =>
    (p.username || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="doctor-patients-container">
      <h2>My Patients</h2>

      <input
        type="text"
        placeholder="Search patient..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="doctor-search"
      />

      {loading ? (
        <p className="doctor-empty">Loading...</p>
      ) : filteredPatients.length === 0 ? (
        <p className="doctor-empty">No patients found</p>
      ) : (
        <table className="doctor-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Blood Group</th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.map((p) => (
              <tr key={p.id}>
                <td>{p.username}</td>
                <td>{p.email}</td>
                <td>{p.age}</td>
                <td>{p.phone}</td>
                <td>{p.gender}</td>
                <td>{p.blood_group}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}