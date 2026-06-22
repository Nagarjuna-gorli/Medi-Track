import { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import Select from "react-select";
import "../../css/DoctorDietPlans.css";

export default function DoctorDietPlans() {
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const formRef = useRef(null);
  const [form, setForm] = useState({
    patient: "",
    title: "",
    description: "",
    morning: "",
    afternoon: "",
    dinner: "",
  });

  const API = "diets/dietplans/";

  // GET PLANS
  const fetchPlans = async () => {
    try {
      const res = await api.get(API);
      setPlans(res.data);
    } catch (err) {
      console.log("GET ERROR:", err.response?.data || err.message);
    }
  };

  // GET COMPLETED PATIENTS (ONLY FOR THIS VIEW)
  const fetchPatients = async () => {
    try {
      const res = await api.get(
        "diets/dietplans/available_patients/"
      );
      setPatients(res.data);
    } catch (err) {
      console.log("PATIENT ERROR:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // CREATE
  const handleCreate = async () => {
  if (!form.patient) return alert("Select patient first");

  try {
    const payload = {
      patient: Number(form.patient),
      title: form.title,
      description: form.description,
      morning: form.morning,
      afternoon: form.afternoon,
      dinner: form.dinner,
    };

    await api.post(API, payload);

    await fetchPlans();

    setForm({
      patient: "",
      title: "",
      description: "",
      morning: "",
      afternoon: "",
      dinner: "",
    });

  } catch (err) {
    console.log("CREATE ERROR:", err.response?.data || err.message);
  }
};
  // UPDATE
  const handleUpdate = async () => {
  try {
    const payload = {
      patient: Number(form.patient),
      title: form.title,
      description: form.description,
      morning: form.morning,
      afternoon: form.afternoon,
      dinner: form.dinner,
    };

    await api.put(`${API}${editingId}/`, payload);

    await fetchPlans();

    setEditingId(null);

    setForm({
      patient: "",
      title: "",
      description: "",
      morning: "",
      afternoon: "",
      dinner: "",
    });

    setSearch("");

  } catch (err) {
    console.log("UPDATE ERROR:", err.response?.data || err.message);
  }
};

  // EDIT
  const handleEdit = (plan) => {
  setEditingId(plan.id);

  setForm({
    patient: plan.patient,
    title: plan.title,
    description: plan.description,
    morning: plan.morning || "",
    afternoon: plan.afternoon || "",
    dinner: plan.dinner || "",
  });

  formRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

  // DELETE
  const handleDelete = async (id) => {
    try {
      await api.delete(`${API}${id}/`);
      fetchPlans();
    } catch (err) {
      console.log("DELETE ERROR:", err.response?.data || err.message);
    }
  };

  // SEARCH FILTER (TITLE + PATIENT NAME)
  const filteredPlans = plans.filter((p) =>
    (
      (p.title || "") +
      " " +
      (p.patient_name || "")
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="diet-container" ref={formRef}>
      <h2>Doctor Diet Plans</h2>

      {/* PATIENT DROPDOWN */}
      <Select
        placeholder="Search Patient..."
        options={patients.map((p) => ({
          value: p.id,
          label: p.patient_name,
        }))}
        value={
  patients.find(
    (p) => p.id === Number(form.patient)
  )
    ? {
        value: Number(form.patient),
        label: patients.find(
          (p) => p.id === Number(form.patient)
        ).patient_name,
      }
    : null
}
        onChange={(selected) =>
          setForm({
            ...form,
            patient: selected ? selected.value : "",
          })
        }
      />

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
      />

      <input
        name="morning"
        value={form.morning}
        onChange={handleChange}
        placeholder="Morning meal"
      />

      <input
        name="afternoon"
        value={form.afternoon}
        onChange={handleChange}
        placeholder="Afternoon meal"
      />

      <input
        name="dinner"
        value={form.dinner}
        onChange={handleChange}
        placeholder="Dinner meal"
      />

      {editingId ? (
        <button onClick={handleUpdate}>Update</button>
      ) : (
        <button onClick={handleCreate}>Create</button>
      )}

      <hr />

      {/* SEARCH BOX */}
      <input
        type="text"
        placeholder="Search diet plans..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      <h2>Diet Plans</h2>

      {filteredPlans.length === 0 ? (
        <p>No Diet Plans found.</p>
      ) : (
        filteredPlans.map((p) => (
          <div key={p.id} className="diet-card">
            <h3>{p.title}</h3>

            <p>
              <b>Patient:</b> {p.patient_name}
            </p>

            <p>
    <b>Doctor:</b> {p.doctor_name}
  </p>

            <p>{p.description}</p>

            <p>Morning: {p.morning}</p>
            <p>Afternoon: {p.afternoon}</p>
            <p>Dinner: {p.dinner}</p>

            <button onClick={() => handleEdit(p)}>✏️ Update</button>
            <button
  onClick={() => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this diet plan?"
    );

    if (confirmDelete) {
      handleDelete(p.id);
    }
  }}
>
  🗑 Delete
</button>
          </div>
        ))
      )}
    </div>
  );
}