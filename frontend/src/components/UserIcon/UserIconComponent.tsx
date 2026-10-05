import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/useAuth.ts";
import Button from "../Button.tsx";

export default function UserIconComponent() {
  const { user, loading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const navigate = useNavigate();

  if (loading) {
    return <div className="user-icon-placeholder" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <Link className="login-link" to="/login">
        Login
      </Link>
    );
  }

  const initials =
    `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      await logout();
      setIsOpen(false);
      navigate("/");
    } catch {
      setLogoutError("Could not log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="user-menu">
      <button
        className="user-icon"
        type="button"
        aria-label="Open user menu"
        aria-expanded={isOpen}
        aria-controls="user-dropdown"
        onClick={() => setIsOpen((current) => !current)}
      >
        {initials}
      </button>

      {isOpen && (
        <div className="user-dropdown" id="user-dropdown">
          <Link to="/profile" onClick={() => setIsOpen(false)}><strong>
            {user.firstName} {user.lastName}
          </strong>
          </Link>
          <span className="user-email">{user.email}</span>
          <span className="user-role">{user.role}</span>

          <Button
            variant="secondary"
            disabled={isLoggingOut}
            onClick={handleLogout}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>

          {logoutError && (
            <span className="logout-error" role="alert">
              {logoutError}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
