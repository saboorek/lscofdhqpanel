import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export const ProtectedRoute = ({ children, requiredRoles }) => {
    const { user, loading } = useUser();
    React.useEffect(() => {
    }, []);
    if (loading) return <div>Ładowanie danych użytkownika...</div>;

    console.log("Dostępne role użytkownika:", user?.roles);
    console.log("Wymagane role:", requiredRoles);

    if (!user || !user.isAuthenticated) {
        return <Navigate to="/" />;
    }

    const hasAccess = requiredRoles.some(role => user.roles?.includes(role));
    console.log("Has access:", hasAccess);

    if (!hasAccess) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};