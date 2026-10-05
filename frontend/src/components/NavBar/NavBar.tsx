import { NavLink } from "react-router-dom";
import { useAuth } from "../../Auth/useAuth.ts";
import UserIconComponent from "../UserIcon/UserIconComponent.tsx";

export default function NavBar() {
  const { user } = useAuth();
  const linkClassName = ({ isActive }: { isActive: boolean }) =>
    isActive ? "active" : "";

  return (
    <nav className="topnav" aria-label="Main navigation">
      <div className="nav-links">
        {user ? (
          <NavLink className={linkClassName} to="/home">
            Home
          </NavLink>
        ) : null}
        <NavLink className={linkClassName} to="/events">
          Events
        </NavLink>
        {user ? (
          <NavLink className={linkClassName} to="/messaging">
            Messaging
          </NavLink>
        ) : null}
        {user ? (
          <NavLink className={linkClassName} to="/myBookings">
            My Bookings
          </NavLink>
        ) : null}
        {user?.role === "ADMIN" ? (
          <NavLink className={linkClassName} to="/users">
            Users
          </NavLink>
        ) : null}
        {user?.role === "ORGANIZER" ? (
          <NavLink className={linkClassName} to="/organiserBookings">
            Requests
          </NavLink>
        ) : null}
      </div>

      <UserIconComponent />
    </nav>
  );
}
