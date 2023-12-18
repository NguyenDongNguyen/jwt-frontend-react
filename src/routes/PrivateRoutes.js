import { useEffect, useContext } from "react";
import { redirect, useNavigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const PrivateRoutes = ({ Component }) => {
    const { user } = useContext(UserContext);
    if (user && user.isAuthenticated === true) {
        return (
            <>
                <Outlet />
            </>
        );
    } else {
        return redirect("home");
    }
};

export default PrivateRoutes;
