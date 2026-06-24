import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function AdminNotifications() {
  const navigate = useNavigate();
const [notifications, setNotifications] = useState([]);
const fetchNotifications = async () => {
  try {
    const res = await api.get("notifications/notifications/");
    const data = Array.isArray(res.data)
      ? res.data
      : res.data?.results || [];

    setNotifications(data);
  } catch (err) {
    console.log(err);
  }
};
  useEffect(() => {
    const token = localStorage.getItem("access");
    fetchNotifications();
    if (!token) {
      console.error("No token found");
      return;
    }

const ws = new WebSocket(
  `ws://127.0.0.1:8001/ws/notifications/?token=${token}`
);

ws.onopen = () => {
  console.log("✅ Admin WebSocket Connected");
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  const notification = msg.data;

  setNotifications((prev) => [notification, ...prev]);
};

ws.onerror = (e) => console.log(e);
ws.onclose = () => console.log("closed");

return () => ws.close();
  }, []);

  return (
    <div>
      <div className="back-container">
          <FaArrowLeft
            className="back-arrow"
            onClick={() => navigate("/admin")}
          />
        </div>
      <h2>Admin Notifications</h2>

      {notifications.map((n, i) => (
        <div
          key={i}
          style={{
            border: "1px solid #ddd",
            margin: 10,
            padding: 10,
          }}
        >
          <h4>{n.title}</h4>
          <p>{n.message}</p>
          <small>{n.notification_type}</small>
          <br/>
          <small>
  {n.created_at
    ? new Date(n.created_at).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "No time"}
</small>
        </div>
      ))}
    </div>
  );
}