import { useState, useEffect } from "react";
import { getActivities } from "../api/activities";
import { useAuth } from "../auth/AuthContext";
import { API } from "../api/activities";

import ActivityList from "./ActivityList";
import ActivityForm from "./ActivityForm";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const { token } = useAuth();

  const syncActivities = async () => {
    const data = await getActivities();
    setActivities(data);
  };

  useEffect(() => {
    syncActivities();
  }, []);

  /** deletes a activity from the API
   * A vaild token is required
   */
  async function deleteActivity(id) {
    try {
      const response = await fetch(`${API}/activities/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const result = null;
      if (response.status !== 204) {
        result = await response.json();
      }

      setActivities((prev) => prev.filter((a) => a.id !== Number(id)));
    } catch (error) {
      console.error("Delete failed:", error.message);
    }
  }

  return (
    <>
      <h1>Activities</h1>
      <ActivityList
        activities={activities}
        token={token}
        deleteActivity={deleteActivity}
      />
      <ActivityForm syncActivities={syncActivities} />
    </>
  );
}
