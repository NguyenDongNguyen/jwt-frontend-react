import React, { useEffect, useState } from "react";
import { getUserAccount } from "../services/userService";

const UserContext = React.createContext(null);

const UserProvider = ({ children }) => {
    // User is the name of the "data" that gets stored in context
    const [user, setUser] = useState({
        isAuthenticated: false,
        token: "",
        account: {},
    });

    // Login updates the user data with a name parameter
    const loginContext = (userData) => {
        setUser(userData);
    };

    // Logout updates the user data to default
    const logout = () => {
        setUser((user) => ({
            name: "",
            auth: false,
        }));
    };

    const fetchUser = async () => {
        let response = await getUserAccount();
        if (response && response.EC === 0) {
            let groupWithRoles = response.DT.groupWithRoles;
            let email = response.DT.email;
            let username = response.DT.username;
            let token = response.DT.access_token;

            let data = {
                isAuthenticated: true,
                token,
                account: { groupWithRoles, email, username },
            };
            setUser(data);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, loginContext, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserProvider, UserContext };
