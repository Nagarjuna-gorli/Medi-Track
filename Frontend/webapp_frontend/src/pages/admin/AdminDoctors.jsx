import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "../../css/AdminDoctors.css";


export default function AdminDoctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get("/doctors/");
      setDoctors(res.data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  const disableDoctor = async (id) => {
    try {
      await api.patch(`/doctors/${id}/disable/`);
      fetchDoctors();
    } catch (err) {
      console.error(err);
    }
  };

  const enableDoctor = async (id) => {
    try {
      await api.patch(`/doctors/${id}/enable/`);
      fetchDoctors();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteDoctor = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this doctor?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/doctors/${id}/`);
      fetchDoctors();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.username?.toLowerCase().includes(search.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-doctors-container">
      <div className="back-container">
          <FaArrowLeft
            className="back-arrow"
            onClick={() => navigate("/admin")}
          />
        </div>
      <h2>Manage Doctors</h2>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search by username or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="loading-text">Loading doctors...</p>
      ) : (
        <div className="table-wrapper">
          <table className="doctor-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Specialization</th>
                <th>Phone</th>
                <th>Hospital</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td>{doctor.username}</td>
                    <td>{doctor.email}</td>
                    <td>{doctor.specialization}</td>
                    <td>{doctor.phone}</td>
                    <td>{doctor.hospital_name}</td>

                    <td>
                      <span
                        className={
                          doctor.is_active
                            ? "status-active"
                            : "status-disabled"
                        }
                      >
                        {doctor.is_active ? "Active" : "Disabled"}
                      </span>
                    </td>

                    <td className="action-buttons">
                        <button
                            className="view-btn"
                            onClick={() => navigate(`/admin/doctors/${doctor.id}`)}
                        >
                            View
                        </button>

                      {doctor.is_active ? (
                        <button
                          className="disable-btn"
                          onClick={() => disableDoctor(doctor.id)}
                        >
                          Disable
                        </button>
                      ) : (
                        <button
                          className="enable-btn"
                          onClick={() => enableDoctor(doctor.id)}
                        >
                          Enable
                        </button>
                      )}

                      <button
                        className="delete-btn"
                        onClick={() => deleteDoctor(doctor.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No doctors found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}