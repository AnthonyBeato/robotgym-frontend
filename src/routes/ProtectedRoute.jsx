import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PropTypes from 'prop-types'; // ES6
import {useContext } from 'react';

const ProtectedRoute = ({ element, allowedRoles }) => {
    const { user } = useContext(AuthContext);

  
    if (!user || !allowedRoles.includes(user.role)) {
      return <Navigate to="/users/login" replace />;
    }
  
    return element;
  };

ProtectedRoute.propTypes = {
    element: PropTypes.string.isRequired,
    allowedRoles: PropTypes.array.isRequired,
}
  

export default ProtectedRoute;
