import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth && auth.token ? children : <Navigate to="/Userlogin" />;
};

export default PrivateRoute;
