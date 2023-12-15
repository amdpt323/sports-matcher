import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./Context/AuthContext";

const useAuth = ()=>{
 const {user} = useContext(AuthContext);
 return user && user.loggedIn;
}

const PrivateRoute = ()=>{
 const isAuth = useAuth();
 return isAuth ? <Outlet /> : <Navigate to="/" />
}

export default PrivateRoute