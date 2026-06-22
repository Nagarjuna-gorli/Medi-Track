import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../css/DoctorNotifications.css";

export default function PatientNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("notifications/notifications/");
      console.log("PATIENT NOTIFICATIONS:", res.data);
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.results || [];

      setNotifications(data);
    } catch (err) {
      console.log(
        "Notification Error:",
        err.response?.data || err.message
      );
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`notifications/${id}/`, {
        is_read: true,
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, is_read: true }
            : n
        )
      );
    } catch (err) {
      console.log(
        "Mark Read Error:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    fetchNotifications();

    const token = localStorage.getItem("access");

    if (!token) return;

   const ws = new WebSocket(
  `ws://127.0.0.1:8001/ws/notifications/?token=${token}`
);

ws.onopen = () => {
  console.log("✅ Patient WebSocket Connected");
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

  if (loading) {
    return <h3>Loading notifications...</h3>;
  }

  return (
    <div className="notifications-container">
      <h2>My Notifications</h2>

      {notifications.length > 0 ? (
        notifications.map((n) => (
<div
  key={n.id}
  className={`notification-card ${
    n.is_read ? "read" : "unread"
  }`}
>
  <h4>{n.title}</h4>

  <p>{n.message}</p>
  
  <small>
    Type: {n.notification_type || "general"}
  </small>
  <br/>

<small>
  {new Date(n.created_at).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}
</small>
</div>
        ))
      ) : (
        <p>No notifications found</p>
      )}
    </div>
  );
}