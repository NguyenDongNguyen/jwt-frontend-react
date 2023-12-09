import { Routes, Route } from "react-router-dom";
import Login from "../components/Login/Login";
import Register from "../components/Register/Register";
import User from "../components/ManageUsers/User";
import PrivateRoutes from "./PrivateRoutes";

const AppRoutes = (props) => {
    const Project = () => {
        return <div>Projects</div>;
    };

    return (
        <>
            <Routes>
                <Route path="/users" element={<PrivateRoutes Component={User} />} />
                <Route
                    path="/projects"
                    element={<PrivateRoutes Component={Project} />}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<PrivateRoutes Component={"Home"} />} />
                <Route path="*" element={"404 not found"} />
            </Routes>
        </>
    );
};

export default AppRoutes;