import { Navigate } from "react-router";
import { useAuth } from "src/hooks/AuthProvider";

export const PrivateRoute = ({ children }) => {
    const { auth } = useAuth()
    // return localStorage.getItem('token') ? children : <Navigate to="/login" />;
    return children;
};