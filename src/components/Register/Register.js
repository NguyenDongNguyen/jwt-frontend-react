import "./Register.scss";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { registerNewUser } from "../../services/userService";

const Register = (props) => {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const defaultValidInput = {
        isValidEmail: true,
        isValidPhone: true,
        isValidPassword: true,
        isValidConfirmPassword: true,
    };
    const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);

    let history = useNavigate();
    const handleLogin = () => {
        history("/login");
    };

    useEffect(() => {
        // axios
        // .get("http://localhost:8080/api/v1/test-api")
        // .then((data) => console.log(">>> check axios: ", data));
    }, []);

    const isValidInputs = () => {
        //reset field input
        setObjCheckInput(defaultValidInput);

        //validate form register
        if (!email) {
            toast.error("Email is required");
            setObjCheckInput({ ...defaultValidInput, isValidEmail: false });
            return false;
        }

        let regx = /\S+@\S+\.\S+/;
        if (!regx.test(email)) {
            toast.error("Please enter a valid email address");
            return false;
        }

        if (!phone) {
            toast.error("Phone is required");
            setObjCheckInput({ ...defaultValidInput, isValidPhone: false });
            return false;
        }
        if (!password) {
            toast.error("Password is required");
            setObjCheckInput({ ...defaultValidInput, isValidPassword: false });
            return false;
        }
        if (password !== confirmPassword) {
            toast.error("Your password is not the same");
            setObjCheckInput({
                ...defaultValidInput,
                isValidConfirmPassword: false,
            });
            return false;
        }

        return true;
    };

    const handleRegister = async () => {
        //validate form
        let check = isValidInputs();

        if (check === true) {
            // call API register with axios
            let response = await registerNewUser(email, phone, username, password);

            // show result from server -> client
            let serverData = response.data;
            if (+serverData.EC === 0) {
                // dấu + convert kiểu string -> number
                toast.success(serverData.EM);
                history("/login");
            } else {
                toast.error(serverData.EM);
                if (serverData.DT === "email error") {
                    setObjCheckInput({
                        ...defaultValidInput,
                        isValidEmail: false,
                    });
                }
                if (serverData.DT === "phone error") {
                    setObjCheckInput({
                        ...defaultValidInput,
                        isValidPhone: false,
                    });
                }
            }
        }
    };

    return (
        <div className="register-container">
            <div className="container">
                <div className="row px-3 px-sm-0">
                    <div className="content-left d-none col-sm-7 d-sm-block">
                        <div className="brand">Dong Nguyen IT</div>
                        <div className="detail">
                            Dong Nguyen IT helps you connect and share with the people in your life
                        </div>
                    </div>
                    <div className="content-right col-12 col-sm-5 d-flex flex-column gap-3 py-3">
                        <div className="brand d-sm-none">Dong Nguyen IT</div>
                        <div className="form-group">
                            <label>Email: </label>
                            <input
                                type="text"
                                className={
                                    objCheckInput.isValidEmail
                                        ? "form-control"
                                        : "form-control is-invalid"
                                }
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone number: </label>
                            <input
                                type="text"
                                className={
                                    objCheckInput.isValidPhone
                                        ? "form-control"
                                        : "form-control is-invalid"
                                }
                                placeholder="Phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Username: </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Password: </label>
                            <input
                                type="password"
                                className={
                                    objCheckInput.isValidPassword
                                        ? "form-control"
                                        : "form-control is-invalid"
                                }
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Re-enter password: </label>
                            <input
                                type="password"
                                className={
                                    objCheckInput.isValidConfirmPassword
                                        ? "form-control"
                                        : "form-control is-invalid"
                                }
                                placeholder="Re-enter password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-primary" onClick={handleRegister}>
                            Register
                        </button>
                        <hr />
                        <div className="text-center">
                            <button className="btn btn-success" onClick={handleLogin}>
                                Already've an account. Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
