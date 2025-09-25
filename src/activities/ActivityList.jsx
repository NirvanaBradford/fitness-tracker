export default function ActivityList({ activities, token, deleteActivity }) {
  return (
    <ul>
      {activities.map((activity) => (
        <li key={activity.id}>
          {activity.name}
          {token && (
            <button onClick={() => deleteActivity(activity.id)}>Delete</button>
          )}
        </li>
      ))}
    </ul>
  );
}
