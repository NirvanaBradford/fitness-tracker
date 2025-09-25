export default function ActivityList({
  activities,
  token,
  deleteActivity,
  deleteErrors,
}) {
  return (
    <ul>
      {activities.map((activity) => (
        <li key={activity.id}>
          {activity.name}
          {token && (
            <button onClick={() => deleteActivity(activity.id)}>Delete</button>
          )}
          {deleteErrors[activity.id] && (
            <p style={{ color: "red" }}>{deleteErrors[activity.id]}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
