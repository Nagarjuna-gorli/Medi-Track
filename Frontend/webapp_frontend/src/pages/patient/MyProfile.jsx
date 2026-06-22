import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../css/MyProfile.css";


function PatientProfile() {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    age: "",
    phone: "",
    address: "",
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
      const res = await api.get("/patients/profile/");
      console.log("PROFILE RESPONSE:", res.data); 
      setProfile(res.data);
      setLoading(false);
    } catch (err) {
      console.log("Error loading patient profile", err);
      setLoading(false);
    }
  };

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // UPDATE PROFILE
  // =========================
  const updateProfile = async () => {
    try {
      const { username, email, ...payload } = profile; // remove read-only fields

      await api.put("/patients/profile/", payload);

      alert("Profile updated successfully");
      setEditing(false);

      fetchProfile(); // refresh updated data
    } catch (err) {
      console.log("Update error", err);
    }
  };

  if (loading) return <h3>Loading profile...</h3>;

  return (
    <div className="patient-profile-container">
      <h2>Patient Profile</h2>

      {/* Username (READ ONLY) */}
      <div>
        <label>Username:</label>
        <input value={profile.username} disabled />
      </div>

      {/* Email (READ ONLY) */}
      <div>
        <label>Email:</label>
        <input value={profile.email} disabled />
      </div>

      {/* Age */}
      <div>
        <label>Age:</label>
        <input
          name="age"
          value={profile.age || ""}
          onChange={handleChange}
          disabled={!editing}
        />
      </div>

      {/* Gender */}
      <div>
        <label>Gender:</label>
        <select
          name="gender"
          value={profile.gender || ""}
          onChange={handleChange}
          disabled={!editing}
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* DOB */}
      <div>
        <label>Date of Birth:</label>
        <input
          type="date"
          name="dob"
          value={profile.dob || ""}
          onChange={handleChange}
          disabled={!editing}
        />
      </div>

      {/* Blood Group */}
      <div>
        <label>Blood Group:</label>
        <select
          name="blood_group"
          value={profile.blood_group || ""}
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
      </div>

      {/* Phone */}
      <div>
        <label>Phone:</label>
        <input
          name="phone"
          value={profile.phone || ""}
          onChange={handleChange}
          disabled={!editing}
        />
      </div>

      {/* Address */}
      <div>
        <label>Address:</label>
        <textarea
          name="address"
          value={profile.address || ""}
          onChange={handleChange}
          disabled={!editing}
        />
      </div>

      {/* Buttons */}
      {!editing ? (
        <button onClick={() => setEditing(true)}>Edit Profile</button>
      ) : (
        <>
          <button onClick={updateProfile}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </>
      )}
    </div>
  );
}

export default PatientProfile;