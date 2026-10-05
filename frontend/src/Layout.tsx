import { Outlet } from "react-router-dom";
import Navbar from "./components/NavBar/NavBar";

export default function Layout() {
  return (
    <div className="site-shell">
      <Navbar />
      <Outlet />
    </div>
  );
}
