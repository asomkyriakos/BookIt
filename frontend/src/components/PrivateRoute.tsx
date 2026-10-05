import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../Auth/useAuth.ts';
import type { Role } from '../Auth/Authentication.tsx';

export function PrivateRoute() {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <p aria-live="polite">Checking session...</p>;
    }

    if (!user) {
        return <Navigate
            to="/login"
            replace
        />
    }

    // Check user roles 
    const userRole = user?.role;
    const currentPage = Object.keys(pagePermissions).find(path => location.pathname.startsWith(path))
    const isAuthorized = currentPage ? pagePermissions[currentPage].includes(userRole) : false // fallback to false

    return isAuthorized
        ? <Outlet />
        : <Navigate
            to="/home"
            replace
        />


}

const pagePermissions: Record<string, Role[]> = {
    "/home":                ["ADMIN", "ORGANIZER", "USER"],
    "/welcome":             ["ADMIN", "ORGANIZER", "USER"],
    "/login":               ["ADMIN", "ORGANIZER", "USER"],
    "/register":            ["ADMIN", "ORGANIZER", "USER"],
    "/users":               ["ADMIN"],
    "/messaging":           ["ADMIN", "ORGANIZER", "USER"],
    "/events":              ["ADMIN", "ORGANIZER", "USER"],
    "/createEvent":         ["ADMIN", "ORGANIZER"],
    "/editEvent":           ["ADMIN", "ORGANIZER"],
    "/profile":             ["ADMIN", "ORGANIZER", "USER"],
    "/booking":             ["ADMIN", "ORGANIZER", "USER"],
    "/myBookings":          ["ADMIN", "ORGANIZER", "USER"],
    "/organiserBookings":   ["ORGANIZER"],

};
