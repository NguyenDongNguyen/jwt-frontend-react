import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.scss";
import { loginUser } from "../../services/userService";
import { UserContext } from "../../context/UserContext";

const Login = (props) => {
    const { loginContext } = useContext(UserContext);

    let history = useNavigate();

    const [valueLogin, setValueLogin] = useState("");
    const [password, setPassword] = useState("");
    const defaultObjValidInput = {
        isValidValueLogin: true,
        isValidPassword: true,
    };
    const [objValidInput, setObjValidInput] = useState(defaultObjValidInput);

    // handle if user had signin then not return login page
    useEffect(() => {
        let session = sessionStorage.getItem("account");
        if (session) {
            history("/");
            window.location.reload();
        }
    }, []);

    const handleCreateNewAccount = () => {
        history("/register");
    };

    const handleLogin = async () => {
        //reset field input
        setObjValidInput(defaultObjValidInput);

        // validate form login
        if (!valueLogin) {
            setObjValidInput({
                ...defaultObjValidInput,
                isValidValueLogin: false,
            });
            toast.error("Please enter your email address or phone number");
            return;
        }

        if (!password) {
            setObjValidInput({
                ...defaultObjValidInput,
                isValidPassword: false,
            });
            toast.error("Please enter your password");
            return;
        }

        // call API login with axios
        let response = await loginUser(valueLogin, password);

        if (response && +response.EC === 0) {
            // dấu + convert string -> number
            //success
            let groupWithRoles = response.DT.groupWithRoles;
            let email = response.DT.email;
            let username = response.DT.username;
            let token = response.DT.access_token;

            let data = {
                isAuthenticated: true,
                token,
                account: { groupWithRoles, email, username },
            };
            console.log(">>> check data: ", data);
            sessionStorage.setItem("account", JSON.stringify(data));
            loginContext(data);

            history("/users");
            // window.location.reload();
        }

        if (response && +response.EC !== 0) {
            //error
            toast.error(response.EM);
        }
    };

    const handlePressEnter = (event) => {
        if (event.keyCode === 13 && event.code === "Enter") {
            handleLogin();
        }
    };

    return (
        <div className="login-container">
            <div className="container">
                <div className="row px-3 px-sm-0">
                    <div className="content-left d-none col-sm-7 d-sm-block">
                        <div className="brand">Dong Nguyen IT</div>
                        <div className="detail">
                            Dong Nguyen IT helps you connect and share with the
                            people in your life
                        </div>
                    </div>
                    <div className="content-right col-12 col-sm-5 d-flex flex-column gap-3 py-3">
                        <div className="brand d-sm-none">Dong Nguyen IT</div>
                        <input
                            type="text"
                            className={
                                objValidInput.isValidValueLogin
                                    ? "form-control"
                                    : "form-control is-invalid"
                            }
                            placeholder="Email address or phone number"
                            value={valueLogin}
                            onChange={(e) => setValueLogin(e.target.value)}
                        />
                        <input
                            type="password"
                            className={
                                objValidInput.isValidPassword
                                    ? "form-control"
                                    : "form-control is-invalid"
                            }
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyUp={(e) => handlePressEnter(e)}
                        />
                        <button className="btn btn-primary" onClick={handleLogin}>
                            Login
                        </button>
                        <span className="text-center">
                            <a className="forgot-password" href="#">
                                Forgot your password?
                            </a>
                        </span>
                        <hr />
                        <div className="text-center">
                            <button
                                className="btn btn-success"
                                onClick={handleCreateNewAccount}
                            >
                                Create new account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
