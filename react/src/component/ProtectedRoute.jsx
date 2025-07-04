import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/NavLogin" state={{ from: location.pathname }} replace/>;
  }

  return children;
}
export default ProtectedRoute;
