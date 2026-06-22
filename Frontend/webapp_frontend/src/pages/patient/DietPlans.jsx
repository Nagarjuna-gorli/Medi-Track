import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../css/DietPlans.css";

export default function DietPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // GET DIET PLANS (PATIENT VIEW)
  const fetchDietPlans = async () => {
    try {
      const res = await api.get("diets/dietplans/");

      console.log("DIET API RESPONSE:", res.data);

      // ✅ SAFE HANDLING (supports array or pagination)
      if (Array.isArray(res.data)) {
        setPlans(res.data);
      } else if (Array.isArray(res.data?.results)) {
        setPlans(res.data.results);
      } else {
        setPlans([]);
      }

    } catch (err) {
      console.log(
        "DIET FETCH ERROR:",
        err.response?.data || err.message
      );
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDietPlans();
  }, []);

  if (loading) {
    return <h3>Loading your diet plans...</h3>;
  }

  return (
    <div className="diet-container">
      <h2>My Diet Plans</h2>

      {plans.length === 0 ? (
        <p>No diet plans assigned yet.</p>
      ) : (
        <div className="diet-grid">
          {plans.map((plan) => (
            <div key={plan.id} className="diet-card">

              <h3>{plan.title}</h3>

              <p>
                <b>Doctor:</b>{" "}
                {plan.doctor_name
                  ? `Dr. ${plan.doctor_name}`
                  : "Not assigned"}
              </p>

              <p>
                <b>Description:</b> {plan.description}
              </p>

              <div className="meals">
                <p><b>Morning:</b> {plan.morning || "Not set"}</p>
                <p><b>Afternoon:</b> {plan.afternoon || "Not set"}</p>
                <p><b>Dinner:</b> {plan.dinner || "Not set"}</p>
              </div>

              <small>
                Created: {new Date(plan.created_at).toLocaleString()}
              </small>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}