import { Navigate } from 'react-router-dom'; // Imported Navigate
import { jwtDecode } from 'jwt-decode';
import { useContext } from 'react';
import { AuthContext } from '../store/AuthContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const { token } = useContext(AuthContext);

    if (!token) {
        return <Navigate to="/no-permission" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        const userRole = decoded.role; 

        if (!allowedRoles.includes(userRole)) {
            return <Navigate to="/no-permission" replace />; 
        }

        return children;
        
    } catch (error) {
        console.error("Token decoding failed:", error);
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;