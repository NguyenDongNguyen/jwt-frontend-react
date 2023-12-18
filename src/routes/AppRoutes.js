import { Routes, Route } from "react-router-dom";
import Login from "../components/Login/Login";
import Register from "../components/Register/Register";
import User from "../components/ManageUsers/User";
import PrivateRoutes from "./PrivateRoutes";

const AppRoutes = (props) => {
    const Project = () => {
        return <div>Projects</div>;
    };

    const Home = () => {
        return <div>Home</div>;
    };

    return (
        <>
            <Routes>
                <Route element={<PrivateRoutes />}>
                    <Route path="/users" element={<User />} />
                    {/* <Route path="/projects" element={<Project />} />
                    <Route path="/" element={<Home />} /> */}
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={"404 not found"} />
            </Routes>
        </>
    );
};

export default AppRoutes;
