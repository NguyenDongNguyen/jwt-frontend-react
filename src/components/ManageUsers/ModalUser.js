import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import { fetchGroup, createNewUser } from "../../services/userService";
import { toast } from "react-toastify";

const ModalUser = (props) => {
    const defaultUserData = {
        email: "",
        phone: "",
        username: "",
        password: "",
        address: "",
        sex: "",
        group: "",
    };

    const validInputsDefault = {
        email: true,
        phone: true,
        username: true,
        password: true,
        address: true,
        sex: true,
        group: true,
    };
    const [userData, setUserData] = useState(defaultUserData);
    const [validInputs, setValidInputs] = useState(validInputsDefault);

    const [userGroups, setUserGroups] = useState([]);

    useEffect(() => {
        getGroup();
    }, []);

    const getGroup = async () => {
        let res = await fetchGroup();
        if (res && res.data && res.data.EC === 0) {
            setUserGroups(res.data.DT);
            if (res.data.DT && res.data.DT.length > 0) {
                let groups = res.data.DT;
                setUserData({ ...userData, group: groups[0].id });
            }
        } else {
            toast.error(res.data.EM);
        }
    };

    const handleOnchangeInput = (value, name) => {
        const newUserData = { ...userData };
        newUserData[name] = value;
        setUserData(newUserData);
    };

    const checkValidateInputs = () => {
        let arr = ["email", "phone", "password", "group"];
        let check = true;
        for (let i = 0; i < arr.length; i++) {
            if (!userData[arr[i]]) {
                let _validInputs = { ...validInputsDefault };
                _validInputs[arr[i]] = false;
                setValidInputs(_validInputs);

                toast.error(`Empty input ${arr[i]}`);
                check = false;
                break;
            }
        }

        return check;
    };

    const handleConfirmUser = async () => {
        let check = checkValidateInputs();
        if (check === true) {
            let res = await createNewUser({
                ...userData,
                groupId: userData[`group`],
            });
            if (res.data && res.data.EC === 0) {
                props.onHide();
                setUserData({ ...defaultUserData, group: userGroups[0].id });
            } else {
                toast.error("Error create user...");
            }
        }
    };

    return (
        <>
            <Modal
                size="lg"
                show={props.show}
                className="modal-user"
                onHide={props.onHide}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <span>{props.title}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="content-body row">
                        <div className="col-12 col-sm-6 form-group">
                            <label>
                                Email address (<span className="red">*</span>) :
                            </label>
                            <input
                                className={
                                    validInputs.email
                                        ? "form-control"
                                        : "form-control is-invalid"
                                }
                                type="email"
                                value={userData.email}
                                onChange={(e) =>
                                    handleOnchangeInput(e.target.value, "email")
                                }
                            />
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>
                                Phone number (<span className="red">*</span>) :
                            </label>
                            <input
                                className={
                                    validInputs.phone
                                        ? "form-control"
                                        : "form-control is-invalid"
                                }
                                type="text"
                                value={userData.phone}
                                onChange={(e) =>
                                    handleOnchangeInput(e.target.value, "phone")
                                }
                            />
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>
                                Username: (<span className="red">*</span>)
                            </label>
                            <input
                                className={
                                    validInputs.username
                                        ? "form-control"
                                        : "form-control is-invalid"
                                }
                                type="text"
                                value={userData.username}
                                onChange={(e) =>
                                    handleOnchangeInput(e.target.value, "username")
                                }
                            />
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>
                                Password: (<span className="red">*</span>)
                            </label>
                            <input
                                className={
                                    validInputs.password
                                        ? "form-control"
                                        : "form-control is-invalid"
                                }
                                type="password"
                                value={userData.password}
                                onChange={(e) =>
                                    handleOnchangeInput(e.target.value, "password")
                                }
                            />
                        </div>
                        <div className="col-12 col-sm-12 form-group">
                            <label>
                                Address: (<span className="red">*</span>)
                            </label>
                            <input
                                className={
                                    validInputs.address
                                        ? "form-control"
                                        : "form-control is-invalid"
                                }
                                type="text"
                                value={userData.address}
                                onChange={(e) =>
                                    handleOnchangeInput(e.target.value, "address")
                                }
                            />
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>
                                Gender: (<span className="red">*</span>)
                            </label>
                            <select
                                className="form-select"
                                onChange={(e) =>
                                    handleOnchangeInput(e.target.value, "sex")
                                }
                            >
                                <option defaultValue="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>
                                Group: (<span className="red">*</span>)
                            </label>
                            <select
                                className={
                                    validInputs.group
                                        ? "form-control"
                                        : "form-control is-invalid"
                                }
                                onChange={(e) =>
                                    handleOnchangeInput(e.target.value, "group")
                                }
                            >
                                {userGroups.length > 0 &&
                                    userGroups.map((item, index) => (
                                        <option
                                            key={`Group-${index}`}
                                            value={item.id}
                                        >
                                            {item.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onHide}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleConfirmUser}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalUser;
