import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../store/AuthContext';

// Wraps the dashboard "/" route:
// - If logged in: show the page normally
// - If not logged in: redirect to /welcome (landing page)
const AuthRoute = ({ children }) => {
    const { token } = useContext(AuthContext);

    if (!token) {
        return <Navigate to="/welcome" replace />;
    }

    return children;
};

export default AuthRoute;