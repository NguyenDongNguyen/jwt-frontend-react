import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PrivateRoutes = ({ Component }) => {
    let history = useNavigate();

    useEffect(() => {
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
