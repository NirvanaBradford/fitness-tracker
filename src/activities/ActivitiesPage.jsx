import { useState, useEffect } from "react";
import { getActivities } from "../api/activities";
import { useAuth } from "../auth/AuthContext";
import { API } from "../api/activities";

import ActivityList from "./ActivityList";
import ActivityForm from "./ActivityForm";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [deleteErrors, setDeleteErrors] = useState({});
  const { token } = useAuth();

  const syncActivities = async () => {
    const data = await getActivities();
    setActivities(data);
  };

  useEffect(() => {
    syncActivities();
  }, []);

  /** deletes an activity from the API
   * A valid token is required
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
      setDeleteErrors((prev) => ({ ...prev, [id]: null }));
    } catch (error) {
      setDeleteErrors((prev) => ({
        ...prev,
        [id]: "You are not authorized to delete this activity.",
      }));

      /** auto clear after 5 seconds
      // used ChatGPT to help me with this*/
      setTimeout(() => {
        setDeleteErrors((prev) => ({ ...prev, [id]: null }));
      }, 5000);
    }
  }

  return (
    <>
      <h1>Activities</h1>
      <ActivityList
        activities={activities}
        token={token}
        deleteActivity={deleteActivity}
        deleteErrors={deleteErrors}
      />
      <ActivityForm syncActivities={syncActivities} />
    </>
  );
}
