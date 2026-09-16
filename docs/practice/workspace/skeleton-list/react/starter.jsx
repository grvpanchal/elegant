import "./UserList.style.css";

/**
 * UserList.
 * While `isLoading`, render 6 skeleton rows that occupy the same height as a
 * real row, hidden from screen readers, inside a region that announces the
 * loading state. The shimmer must respect prefers-reduced-motion (CSS).
 */
export default function UserList({ users = [], isLoading = false }) {
  // Your code here.
  if (isLoading) return <p>Loading…</p>;
  return (
    <ul className="user-list">
      {users.map((u) => (
        <li key={u.id} className="user-card">{u.name}</li>
      ))}
    </ul>
  );
}
