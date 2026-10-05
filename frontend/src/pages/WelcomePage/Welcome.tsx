import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../Auth/useAuth";

export default function Welcome() {

  const { user, loading } = useAuth();

  if (loading) {
    return <p aria-live="polite">Checking session...</p>;
  }

  if (user) {
    return <Navigate
      to="/home"
      replace
    />
  }

  return (
    <main className="welcome-page">
      <h1>Welcome to BookIT</h1>
      <p>You can search here your favourite event.</p>
      <div className="welcome-actions">
        <Link className="button" to="/events">
          Search events
        </Link>
        <Link className="button button--secondary" to="/register">
          Register
        </Link>
        <Link className="button button--secondary" to="/login">
          Login
        </Link>
      </div>
    </main>
  );
}
