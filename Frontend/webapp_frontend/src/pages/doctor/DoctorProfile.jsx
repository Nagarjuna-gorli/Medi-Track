import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../css/DoctorProfile.css"

function DoctorProfile() {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    specialization: "",
    phone: "",
    hospital_name: "",
    hospital_address: "",
    gender: "",
    dob: "",
    blood_group: "",
  });

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  // =========================
  // GET PROFILE
  // =========================
  const fetchProfile = async () => {
    try {
      const res = await api.get("/doctors/profile/");
      console.log("DOCTOR PROFILE:", res.data);

      setProfile({
        username: res.data.username || "",
        email: res.data.email || "",
        specialization: res.data.specialization || "",
        phone: res.data.phone || "",
        hospital_name: res.data.hospital_name || "",
        hospital_address: res.data.hospital_address || "",
        gender: res.data.gender || "",
        dob: res.data.dob || "",
        blood_group: res.data.blood_group || "",
      });

      setLoading(false);
    } catch (err) {
      console.log("Error loading doctor profile", err);
      setLoading(false);
    }
  };

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================
  // UPDATE PROFILE
  // =========================
  const updateProfile = async () => {
    try {
      const { username, email, ...payload } = profile;

      await api.put("/doctors/profile/", payload);

      alert("Profile updated successfully");
      setEditing(false);
      fetchProfile();
    } catch (err) {
      console.log("Update error", err);
    }
  };

  if (loading) return <h3>Loading doctor profile...</h3>;

  return (
    <div className="doctor-profile-container">
      <h2>Doctor Profile</h2>

      <label>Username:</label>
      <input value={profile.username} disabled />

      <label>Email:</label>
      <input value={profile.email} disabled />

      <label>Specialization:</label>
      <input
        name="specialization"
        value={profile.specialization}
        onChange={handleChange}
        disabled={!editing}
      />

      <label>Phone:</label>
      <input
        name="phone"
        value={profile.phone}
        onChange={handleChange}
        disabled={!editing}
      />

      <label>Hospital Name:</label>
      <input
        name="hospital_name"
        value={profile.hospital_name}
        onChange={handleChange}
        disabled={!editing}
      />

      <label>Hospital Address:</label>
      <textarea
        name="hospital_address"
        value={profile.hospital_address}
        onChange={handleChange}
        disabled={!editing}
      />

      <label>Gender:</label>
      <select
        name="gender"
        value={profile.gender}
        onChange={handleChange}
        disabled={!editing}
      >
        <option value="">Select</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <label>Date of Birth:</label>
      <input
        type="date"
        name="dob"
        value={profile.dob}
        onChange={handleChange}
        disabled={!editing}
      />

      <label>Blood Group:</label>
      <select
        name="blood_group"
        value={profile.blood_group}
        onChange={handleChange}
        disabled={!editing}
      >
        <option value="">Select</option>
        <option value="A+">A+</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B-">B-</option>
        <option value="AB+">AB+</option>
        <option value="AB-">AB-</option>
        <option value="O+">O+</option>
        <option value="O-">O-</option>
      </select>

     {!editing ? (
  <button
    type="button"
    className="edit-btn"
    onClick={() => setEditing(true)}
  >
    Edit Profile
  </button>
) : (
  <div className="profile-buttons">
    <button
      type="button"
      className="save-btn"
      onClick={updateProfile}
    >
      Save Changes
    </button>

    <button
      type="button"
      className="cancel-btn"
      onClick={() => setEditing(false)}
    >
      Cancel
    </button>
  </div>
)}
    </div>
  );
}

export default DoctorProfile;