import React,{useContext} from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const ProtectedRoute = ({ element: Component, ...rest }) => {
    const { currentUser } = useContext(AppContext);
  return currentUser ? <Component {...rest} /> : <Navigate to="/login" />;
  
};

export default ProtectedRoute;