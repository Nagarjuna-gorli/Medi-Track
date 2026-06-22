import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../css/AdminPrescriptions.css";

export default function AdminPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedPrescription, setSelectedPrescription] =
    useState(null);

  const [editingPrescription, setEditingPrescription] =
    useState(null);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const [formData, setFormData] = useState({
    doctor: "",
    patient: "",
    medicine: "",
    dosage: "",
    instructions: "",
  });

  useEffect(() => {
    fetchPrescriptions();
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterPrescriptions();
  }, [search, startDate, endDate, prescriptions]);

  const fetchDoctors = async () => {
  try {
    const res = await api.get("appointments/doctors/");
    setDoctors(res.data);
  } catch (err) {
    console.log(err);
  }
};
  const fetchDoctorPatients = async (doctorId) => {
  try {
    const res = await api.get(
      `prescriptions/doctor_patients/?doctor=${doctorId}`
    );

    setPatients(res.data);
  } catch (err) {
    console.log(err);
  }
};

const handleCreateChange = (e) => {
  const { name, value } = e.target;

  setFormData({
    ...formData,
    [name]: value,
  });

  if (name === "doctor") {
    setFormData((prev) => ({
      ...prev,
      doctor: value,
      patient: "",
    }));

    fetchDoctorPatients(value);
  }
};

const createPrescription = async (e) => {
  e.preventDefault();

  try {
    await api.post("prescriptions/", formData);

    alert("Prescription Created Successfully");

    setFormData({
      doctor: "",
      patient: "",
      medicine: "",
      dosage: "",
      instructions: "",
    });

    setPatients([]);

    fetchPrescriptions();
  } catch (err) {
    console.log(err.response?.data);

    alert(
      JSON.stringify(
        err.response?.data || "Creation Failed"
      )
    );
  }
};

  const fetchPrescriptions = async () => {
    try {
      const res = await api.get("prescriptions/");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.results || [];

      setPrescriptions(data);
      setFilteredPrescriptions(data);
    } catch (err) {
      console.log(err);
    }
  };

  const filterPrescriptions = () => {
    let filtered = [...prescriptions];

    if (search.trim()) {
      filtered = filtered.filter(
        (p) =>
          p.patient_name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          p.doctor_name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          p.medicine
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    if (startDate) {
      filtered = filtered.filter(
        (p) =>
          new Date(p.created_at) >=
          new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (p) =>
          new Date(p.created_at) <=
          new Date(endDate + "T23:59:59")
      );
    }

    filtered.sort(
      (a, b) =>
        new Date(b.created_at) -
        new Date(a.created_at)
    );

    setFilteredPrescriptions(filtered);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this prescription?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`prescriptions/${id}/`);
      fetchPrescriptions();
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  const handleEdit = (prescription) => {
    setEditingPrescription({
      ...prescription,
    });
  };

const saveUpdate = async () => {
  try {
    await api.patch(
      `prescriptions/${editingPrescription.id}/`,
      {
        medicine: editingPrescription.medicine,
        dosage: editingPrescription.dosage,
        instructions:
          editingPrescription.instructions,
      }
    );

    alert("Prescription updated successfully");

    setEditingPrescription(null);

    fetchPrescriptions();

  } catch (err) {
    console.log(
      "UPDATE ERROR:",
      err.response?.data
    );

    alert(
      JSON.stringify(
        err.response?.data || "Update failed"
      )
    );
  }
};

  return (
    <div className="admin-prescriptions-container">
  <div className="create-prescription-card">
  <h2>Create Prescription</h2>

  <form onSubmit={createPrescription}>

    <select
      name="doctor"
      value={formData.doctor}
      onChange={handleCreateChange}
      required
    >
      <option value="">
        Select Doctor
      </option>

      {doctors.map((doctor) => (
        <option
          key={doctor.id}
          value={doctor.id}
        >
          {doctor.doctor_name}
        </option>
      ))}
    </select>

    <select
      name="patient"
      value={formData.patient}
      onChange={handleCreateChange}
      required
    >
      <option value="">
        Select Patient
      </option>

      {patients.map((patient) => (
        <option
          key={patient.id}
          value={patient.id}
        >
          {patient.patient_name}
        </option>
      ))}
    </select>

    <input
      type="text"
      name="medicine"
      placeholder="Medicine"
      value={formData.medicine}
      onChange={handleCreateChange}
      required
    />

    <input
      type="text"
      name="dosage"
      placeholder="Dosage"
      value={formData.dosage}
      onChange={handleCreateChange}
      required
    />

    <textarea
      name="instructions"
      placeholder="Instructions"
      value={formData.instructions}
      onChange={handleCreateChange}
      required
    />

    <button
      type="submit"
      className="save-btn"
    >
      Create Prescription
    </button>

  </form>
</div> 
      <h2>Prescription Management</h2>

      <div className="prescription-filters">
        <input
          type="text"
          placeholder="Search Patient / Doctor / Medicine"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <input
          type="date"
          value={startDate}
          onChange={(e) =>
            setStartDate(e.target.value)
          }
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) =>
            setEndDate(e.target.value)
          }
        />

        <button onClick={fetchPrescriptions}>
          Refresh
        </button>
      </div>

     <div className="prescription-summary">

  <div className="summary-card">
    <h3>{filteredPrescriptions.length}</h3>
    <p>Total Prescriptions</p>
  </div>

  <div className="summary-card">
    <h3>
      {
        filteredPrescriptions.filter(
          (p) =>
            new Date(p.created_at).toDateString() ===
            new Date().toDateString()
        ).length
      }
    </h3>
    <p>Today's Prescriptions</p>
  </div>

  <div className="summary-card">
    <h3>
      {
        new Set(
          filteredPrescriptions.map(
            (p) => p.patient_name
          )
        ).size
      }
    </h3>
    <p>Patients Covered</p>
  </div>

  <div className="summary-card">
    <h3>
      {
        new Set(
          filteredPrescriptions.map(
            (p) => p.doctor_name
          )
        ).size
      }
    </h3>
    <p>Doctors Involved</p>
  </div>

</div>

      <table className="prescription-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Medicine</th>
            <th>Dosage</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredPrescriptions.length > 0 ? (
            filteredPrescriptions.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>

                <td>{p.patient_name}</td>

                <td>{p.doctor_name}</td>

                <td>{p.medicine}</td>

                <td>{p.dosage}</td>

                <td>
                  {new Date(
                    p.created_at
                  ).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>

                <td>
                  <button
                    className="view-btn"
                    onClick={() =>
                      setSelectedPrescription(p)
                    }
                  >
                    View
                  </button>

                  <button
                    className="edit-btn"
                    onClick={() =>
                      handleEdit(p)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(p.id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">
                No prescriptions found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* View Modal */}

      {selectedPrescription && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Prescription Details</h2>

            <p>
              <strong>ID:</strong>{" "}
              {selectedPrescription.id}
            </p>

            <p>
              <strong>Patient:</strong>{" "}
              {selectedPrescription.patient_name}
            </p>

            <p>
              <strong>Doctor:</strong>{" "}
              {selectedPrescription.doctor_name}
            </p>

            <p>
              <strong>Medicine:</strong>{" "}
              {selectedPrescription.medicine}
            </p>

            <p>
              <strong>Dosage:</strong>{" "}
              {selectedPrescription.dosage}
            </p>

            <p>
              <strong>Instructions:</strong>{" "}
              {selectedPrescription.instructions}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(
                selectedPrescription.created_at
              ).toLocaleString()}
            </p>

            <button
              className="close-btn"
              onClick={() =>
                setSelectedPrescription(null)
              }
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}

      {editingPrescription && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Prescription</h2>

            <input
              type="text"
              value={editingPrescription.medicine}
              onChange={(e) =>
                setEditingPrescription({
                  ...editingPrescription,
                  medicine: e.target.value,
                })
              }
            />

            <input
              type="text"
              value={editingPrescription.dosage}
              onChange={(e) =>
                setEditingPrescription({
                  ...editingPrescription,
                  dosage: e.target.value,
                })
              }
            />

            <textarea
              rows="5"
              value={
                editingPrescription.instructions
              }
              onChange={(e) =>
                setEditingPrescription({
                  ...editingPrescription,
                  instructions:
                    e.target.value,
                })
              }
            />

            <button
              className="save-btn"
              onClick={saveUpdate}
            >
              Save
            </button>

            <button
              className="cancel-btn"
              onClick={() =>
                setEditingPrescription(null)
              }
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}