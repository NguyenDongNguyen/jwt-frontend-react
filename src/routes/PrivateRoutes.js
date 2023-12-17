import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const PrivateRoutes = ({ Component }) => {
    let history = useNavigate();
    const { user } = useContext(UserContext);

    useEffect(() => {
        console.log(">>> check content user: ", user);
        let session = sessionStorage.getItem("account");
        if (!session) {
            history("/login");
            window.location.reload();
        }
    }, []);

    return (
        <>
            <Component />
        </>
    );
};

export default PrivateRoutes;
