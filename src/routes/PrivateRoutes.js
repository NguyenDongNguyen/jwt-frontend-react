import { useEffect, useContext } from "react";
import { redirect, useNavigate, Outlet, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const PrivateRoutes = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    // {user && user.isAuthenticated === true ? <Outlet /> : redirect("/login")}
    if (user && user.isAuthenticated === true) {
        return (
            <>
                <Outlet />
            </>
        );
    } else {
        // if (location.pathname === "/") {
        //     navigate("/login");
        //     window.location.reload();
        // }
        // navigate("/login");
        navigate("/login");
        window.location.reload();
    }
};

export default PrivateRoutes;
