import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../css/AdminDietPlans.css";

export default function AdminDietPlans() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedPlan, setSelectedPlan] =
    useState(null);

  const [formData, setFormData] = useState({
    doctor: "",
    patient: "",
    title: "",
    description: "",
    morning: "",
    afternoon: "",
    dinner: "",
  });

  useEffect(() => {
    fetchPlans();
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterPlans();
  }, [plans, search, startDate, endDate]);

  // ==========================
  // FETCH PLANS
  // ==========================

 const fetchPlans = async () => {
  try {
    const res = await api.get("/diets/dietplans/");

    const data = res.data.results ?? res.data;

    setPlans(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error(err);
    setPlans([]);
  }
};
  // ==========================
  // FETCH DOCTORS
  // ==========================

const fetchDoctors = async () => {
  try {
    const res = await api.get("/doctors/");
    console.log("Doctors:", res.data);
    setDoctors(res.data);
  } catch (err) {
    console.error(err);
  }
};

const fetchDoctorPatients = async (doctorId) => {
  try {
    const res = await api.get(
      `/diets/dietplans/available_patients/?doctor=${doctorId}`
    );
    console.log("Patients:", res.data);
    setPatients(res.data);
  } catch (err) {
    console.error(err);
  }
};
  // ==========================
  // FILTER
  // ==========================

  const filterPlans = () => {
    let filtered = Array.isArray(plans) ? [...plans] : [];

    if (search.trim()) {
      filtered = filtered.filter(
        (p) =>
          p.patient_name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          p.doctor_name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          p.title
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

    setFilteredPlans(filtered);
  };

  // ==========================
  // DOCTOR CHANGE
  // ==========================

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;

    setFormData({
      ...formData,
      doctor: doctorId,
      patient: "",
    });

    fetchDoctorPatients(doctorId);
  };

  // ==========================
  // SUBMIT
  // ==========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(
          `/diets/dietplans/${editingId}/`,
          formData
        );
      } else {
        await api.post(
          "diets/dietplans/",
          formData
        );
      }

      resetForm();
      fetchPlans();
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================
  // EDIT
  // ==========================

  const handleEdit = (plan) => {
    setEditingId(plan.id);

    setFormData({
      doctor: plan.doctor,
      patient: plan.patient,
      title: plan.title,
      description: plan.description,
      morning: plan.morning,
      afternoon: plan.afternoon,
      dinner: plan.dinner,
    });

    fetchDoctorPatients(plan.doctor);
  };

  // ==========================
  // DELETE
  // ==========================

  const handleDelete = async (id) => {
    if (!window.confirm("Delete diet plan?"))
      return;

    try {
      await api.delete(`/diets/dietplans/${id}/`);
      fetchPlans();
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================
  // RESET
  // ==========================

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      doctor: "",
      patient: "",
      title: "",
      description: "",
      morning: "",
      afternoon: "",
      dinner: "",
    });

    setPatients([]);
  };

  return (
    <div className="admin-health-container">
      <div className="back-container">
          <FaArrowLeft
            className="back-arrow"
            onClick={() => navigate("/admin")}
          />
        </div>

      <h2>Diet Plan Management</h2>

      {/* CREATE FORM */}

      <div className="create-health-card">
        <h3>
          {editingId
            ? "Update Diet Plan"
            : "Create Diet Plan"}
        </h3>

        <form onSubmit={handleSubmit}>

          <select
            value={formData.doctor}
            onChange={handleDoctorChange}
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
                {doctor.username}
              </option>
            ))}
          </select>

          <select
            value={formData.patient}
            onChange={(e) =>
              setFormData({
                ...formData,
                patient: e.target.value,
              })
            }
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
            placeholder="Plan Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
              })
            }
            required
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description:
                  e.target.value,
              })
            }
          />

          <textarea
            placeholder="Morning Diet"
            value={formData.morning}
            onChange={(e) =>
              setFormData({
                ...formData,
                morning: e.target.value,
              })
            }
          />

          <textarea
            placeholder="Afternoon Diet"
            value={formData.afternoon}
            onChange={(e) =>
              setFormData({
                ...formData,
                afternoon:
                  e.target.value,
              })
            }
          />

          <textarea
            placeholder="Dinner Diet"
            value={formData.dinner}
            onChange={(e) =>
              setFormData({
                ...formData,
                dinner: e.target.value,
              })
            }
          />

          <button type="submit" className="create-btn" >
            {editingId
              ? "Update Plan"
              : "Create Plan"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* SEARCH */}

      <div className="search-bar">
        <input
          placeholder="Search Patient / Doctor / Title"
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
      </div>

      {/* SUMMARY */}

      <div className="health-summary">

        <div className="summary-card">
          <h3>{filteredPlans.length}</h3>
          <p>Total Plans</p>
        </div>

        <div className="summary-card">
          <h3>
            {
              new Set(
                filteredPlans.map(
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
                filteredPlans.map(
                  (p) => p.doctor_name
                )
              ).size
            }
          </h3>
          <p>Doctors Involved</p>
        </div>

      </div>


      {/* TABLE */}

      <table className="health-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Title</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredPlans.map((plan) => (
            <tr key={plan.id}>
              <td>{plan.id}</td>
              <td>{plan.patient_name}</td>
              <td>{plan.doctor_name}</td>
              <td>{plan.title}</td>

              <td>
                {new Date(
                  plan.created_at
                ).toLocaleDateString()}
              </td>

              <td>
                <button
                  className="view-btn"
                  onClick={() =>
                    setSelectedPlan(plan)
                  }
                >
                  View
                </button>
                {selectedPlan && (
  <div className="modal-overlay">
    <div className="modal-box">
      
      <h3>Diet Plan Details</h3>

      <p><b>Doctor:</b> {selectedPlan.doctor_name}</p>
      <p><b>Patient:</b> {selectedPlan.patient_name}</p>
      <p><b>Title:</b> {selectedPlan.title}</p>
      <p><b>Description:</b> {selectedPlan.description}</p>

      <p><b>Morning:</b> {selectedPlan.morning}</p>
      <p><b>Afternoon:</b> {selectedPlan.afternoon}</p>
      <p><b>Dinner:</b> {selectedPlan.dinner}</p>

      <button onClick={() => setSelectedPlan(null)}>
        Close
      </button>

    </div>
  </div>
)}

                <button
                  className="edit-btn"
                  onClick={() =>
                    handleEdit(plan)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(plan.id)
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
  );
}