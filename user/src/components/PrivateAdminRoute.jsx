import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types"; 

const PrivateAdminRoute = ({ children, isAdmin = false }) => {
  const { currentAdmin } = useSelector((state) => state.admin);

  if (!currentAdmin) {
    return <Navigate to="/admin/sign-in" />;
  }

  if (isAdmin && !currentAdmin.isAdmin) {
    return <Navigate to="/admin" />;
  }

  return children;
};

PrivateAdminRoute.propTypes = {
    children: PropTypes.node.isRequired,
    isAdmin: PropTypes.bool
  };
  

export default PrivateAdminRoute;
