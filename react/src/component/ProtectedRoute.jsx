import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
