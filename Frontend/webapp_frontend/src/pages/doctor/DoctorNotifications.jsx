import { useEffect, useRef, useState } from "react";
import api from "../../services/api";

export default function DoctorNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const socketRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("notifications/notifications/");

      console.log("Notification Data:", res.data);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.results || [];

      setNotifications(data);
    } catch (err) {
      console.log("API ERROR:", err.response?.data || err.message);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const token = localStorage.getItem("access");

    if (!token) {
      console.log("❌ No access token found");
      return;
    }

    console.log("TOKEN:", token);

    const ws = new WebSocket(
  `ws://127.0.0.1:8001/ws/notifications/?token=${token}`
);

ws.onopen = () => {
  console.log("✅ Doctor WebSocket Connected");
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
    <div style={{ padding: "20px" }}>
      <h2>Doctor Notifications</h2>

      {notifications.length > 0 ? (
        notifications.map((n, i) => (
          <div
            key={n.id || i}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "10px",
              background: "#fff",
            }}
          >
            <h4>{n.title}</h4>

            <p>{n.message}</p>

            <small>
              Type: {n.notification_type || "appointment"}
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
        <p>No notifications available.</p>
      )}
    </div>
  );
}