import { useEffect, useState,useRef } from "react";
import Select from "react-select";
import api from "../../services/api";
import "../../css/DoctorPrescriptions.css";

export default function DoctorPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const formRef = useRef(null);
  const [editingId, setEditingId] = useState(null);

  const [prescriptionSearch, setPrescriptionSearch] =
    useState("");

  const [formData, setFormData] = useState({
    patient: "",
    medicine: "",
    dosage: "",
    instructions: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const presRes = await api.get("prescriptions/");
      setPrescriptions(presRes.data);

      const patientRes = await api.get(
        "prescriptions/completed-patients/"
      );

      const mapped = patientRes.data.map((p) => ({
        id: p.patient,
        username: p.patient_name,
      }));

      setPatients(mapped);
    } catch (err) {
      console.error(
        "Error loading data:",
        err.response?.data || err
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      patient: "",
      medicine: "",
      dosage: "",
      instructions: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(
          `prescriptions/${editingId}/`,
          formData
        );
        alert("Prescription updated successfully");
      } else {
        await api.post(
          "prescriptions/",
          formData
        );
        alert("Prescription added successfully");
      }

      resetForm();
      fetchData();
    } catch (err) {
      console.error(
        "Prescription save failed:",
        err.response?.data
      );
    }
  };

  const handleEdit = (prescription) => {
    setEditingId(prescription.id);

    setFormData({
      patient: prescription.patient,
      medicine: prescription.medicine,
      dosage: prescription.dosage,
      instructions:
        prescription.instructions || "",
    });

    formRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this prescription?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`prescriptions/${id}/`);
      alert("Prescription deleted successfully");
      fetchData();
    } catch (err) {
      console.error(
        "Delete failed:",
        err.response?.data
      );
    }
  };

  const patientOptions = patients.map(
    (patient) => ({
      value: patient.id,
      label: patient.username,
    })
  );

  const filteredPrescriptions =
    prescriptions.filter(
      (p) =>
        p.patient_name
          ?.toLowerCase()
          .includes(
            prescriptionSearch.toLowerCase()
          ) ||
        p.medicine
          ?.toLowerCase()
          .includes(
            prescriptionSearch.toLowerCase()
          )
    );

  if (loading) {
    return <h3>Loading prescriptions...</h3>;
  }

  return (
    <div className="prescription-container" ref={formRef}>
      <h2>
        {editingId
          ? "Edit Prescription"
          : "Create Prescription"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="prescription-form"
      >
        {/* Searchable Patient Dropdown */}
        <Select
          options={patientOptions}
          placeholder="Search & Select Patient"
          isSearchable
          value={
            patientOptions.find(
              (option) =>
                option.value ===
                formData.patient
            ) || null
          }
          onChange={(selected) =>
            setFormData({
              ...formData,
              patient: selected
                ? selected.value
                : "",
            })
          }
        />

        <input
          type="text"
          name="medicine"
          placeholder="Medicine"
          value={formData.medicine}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="dosage"
          placeholder="Dosage"
          value={formData.dosage}
          onChange={handleChange}
          required
        />

        <textarea
          name="instructions"
          placeholder="Instructions"
          value={formData.instructions}
          onChange={handleChange}
        />

        <button type="submit">
          {editingId
            ? "Update Prescription"
            : "Add Prescription"}
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

      <hr />

      <h2>My Prescriptions</h2>

      {/* Search Box */}
      <input
        type="text"
        className="prescription-search"
        placeholder="Search by patient name or medicine..."
        value={prescriptionSearch}
        onChange={(e) =>
          setPrescriptionSearch(
            e.target.value
          )
        }
      />

      {filteredPrescriptions.length === 0 ? (
        <p>No prescriptions found.</p>
      ) : (
        filteredPrescriptions.map((p) => (
          <div
            key={p.id}
            className="card"
          >
            <h3>
              Patient: {p.patient_name}
            </h3>

            <p>
              <strong>Medicine:</strong>{" "}
              {p.medicine}
            </p>

            <p>
              <strong>Dosage:</strong>{" "}
              {p.dosage}
            </p>

            <p>
              <strong>Instructions:</strong>{" "}
              {p.instructions || "N/A"}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(
                p.created_at
              ).toLocaleString()}
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  handleEdit(p)
                }
              >
                  ✏️ Update
              </button>

              <button
                type="button"
               onClick={() => handleDelete(p.id)}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}