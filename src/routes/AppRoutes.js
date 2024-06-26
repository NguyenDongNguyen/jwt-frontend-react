import { Routes, Route } from "react-router-dom";
import Login from "../components/Login/Login";
import Register from "../components/Register/Register";
import User from "../components/ManageUsers/User";
import PrivateRoutes from "./PrivateRoutes";
import Role from "../components/Role/Role";
import GroupRole from "../components/GroupRole/GroupRole";

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
                    <Route path="/projects" element={<Project />} />
                    <Route path="/roles" element={<Role />} />
                    <Route path="/group-role" element={<GroupRole />} />
                </Route>

                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={"404 not found"} />
            </Routes>
        </>
    );
};

export default AppRoutes;
