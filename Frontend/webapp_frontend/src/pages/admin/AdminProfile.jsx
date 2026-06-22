import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../css/AdminProfile.css";

export default function AdminProfile() {
  const [profile, setProfile] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("adminpanel/profile/");

      setProfile(res.data);
    } catch (err) {
      console.log(
        "Profile Error:",
        err.response?.data
      );
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      await api.patch(
        "adminpanel/profile/",
        {
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          phone: profile.phone,
        }
      );

      alert("Profile Updated Successfully ✅");

      setEditing(false);

      fetchProfile();
    } catch (err) {
      console.log(
        "Update Error:",
        err.response?.data
      );

      alert("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="admin-profile-container">
        <h2>Loading Profile...</h2>
      </div>
    );
  }

  return (
    <div className="admin-profile-container">
      <div className="profile-card">
        <h2>Admin Profile</h2>

        <form onSubmit={updateProfile}>
          {/* Username */}
          <label>Username</label>
          <input
            type="text"
            value={profile.username}
            disabled
          />

          {/* First Name */}
          <label>First Name</label>
          <input
            type="text"
            value={profile.first_name || ""}
            disabled={!editing}
            onChange={(e) =>
              setProfile({
                ...profile,
                first_name: e.target.value,
              })
            }
          />

          {/* Last Name */}
          <label>Last Name</label>
          <input
            type="text"
            value={profile.last_name || ""}
            disabled={!editing}
            onChange={(e) =>
              setProfile({
                ...profile,
                last_name: e.target.value,
              })
            }
          />

          {/* Email */}
          <label>Email</label>
          <input
            type="email"
            value={profile.email || ""}
            disabled={!editing}
            onChange={(e) =>
              setProfile({
                ...profile,
                email: e.target.value,
              })
            }
          />
          <label>Phone Number</label>

          <input
            type="text"
            value={profile.phone || ""}
            disabled={!editing}
            onChange={(e) =>
              setProfile({
                ...profile,
                phone: e.target.value,
              })
            }
          />

          {/* Role */}
          <label>Role</label>
          <input
            type="text"
            value={profile.role}
            disabled
          />

          {/* Buttons */}
          {!editing ? (
            <button
              type="button"
              className="edit-btn"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                type="submit"
                className="save-btn"
              >
                Save Changes
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setEditing(false);
                  fetchProfile();
                }}
              >
                Cancel
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}