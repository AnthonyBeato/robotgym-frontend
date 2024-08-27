import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PropTypes from 'prop-types'; // ES6
import {useContext } from 'react';

const ProtectedRoute = ({ element, allowedRoles }) => {
    const { user } = useContext(AuthContext);

  
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/error-401" replace />;
    } else if (!user){
      return <Navigate to="/users/login" replace />;
    }
  
    return element;
  };

ProtectedRoute.propTypes = {
    element: PropTypes.object.isRequired,
    allowedRoles: PropTypes.array.isRequired,
}
  

export default ProtectedRoute;
