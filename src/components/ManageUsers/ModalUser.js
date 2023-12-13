import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import {
    fetchGroup,
    createNewUser,
    updateCurrentUser,
} from "../../services/userService";
import { toast } from "react-toastify";

const ModalUser = (props) => {
    const { action, dataModalUser } = props;

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

    // vào modal user create lần đầu
    useEffect(() => {
        getGroup();
    }, []);

    // khi vào modal user update thì call useEffect để fill data vào input
    useEffect(() => {
        if (action === "UPDATE") {
            setUserData({
                ...dataModalUser,
                group: dataModalUser.Group ? dataModalUser.Group.id : "",
            });
        }
    }, [dataModalUser]);

    // khi vào modal user create các lần tiếp theo(bởi vì khi ẩn modal sẽ bị set ô input = '')
    useEffect(() => {
        if (action === "CREATE") {
            if (userGroups && userGroups.length > 0) {
                setUserData({ ...userData, group: userGroups[0].id });
            }
        }
    }, [action]);

    // lấy data group từ DB để set vào form select
    const getGroup = async () => {
        let res = await fetchGroup();
        if (res && res.EC === 0) {
            setUserGroups(res.DT);
            //gán gtri default cho form select group là ptu đầu tiên
            if (res.DT && res.DT.length > 0) {
                let groups = res.DT;
                setUserData({ ...userData, group: groups[0].id });
            }
        } else {
            toast.error(res.EM);
        }
    };

    const handleOnchangeInput = (value, name) => {
        const newUserData = { ...userData };
        newUserData[name] = value;
        setUserData(newUserData);
    };

    const checkValidateInputs = () => {
        if (action === "UPDATE") {
            return true;
        }
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
            let res =
                action === "CREATE"
                    ? await createNewUser({
                          ...userData,
                          groupId: userData[`group`],
                      })
                    : await updateCurrentUser({
                          ...userData,
                          groupId: userData[`group`],
                      });

            if (res && res.EC === 0) {
                props.onHide();
                //reset lại các ô input trong form và set gtri default cho group
                setUserData({
                    ...defaultUserData,
                    group:
                        userGroups && userGroups.length > 0 ? userGroups[0].id : "",
                });
            }
            if (res && res.EC !== 0) {
                toast.error(res.EM);
                let _validInputs = { ...validInputsDefault };
                _validInputs[res.DT] = false;
                setValidInputs(_validInputs);
            }
        }
    };

    // set lại các gtri và validate của ô input mỗi khi ẩn modal
    const handleCloseModalUser = () => {
        props.onHide();
        setUserData(defaultUserData);
        setValidInputs(validInputsDefault);
    };

    return (
        <>
            <Modal
                size="lg"
                show={props.show}
                className="modal-user"
                onHide={() => handleCloseModalUser()}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <span>
                            {props.action === "CREATE"
                                ? "Create new user"
                                : "Edit a user"}
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="content-body row">
                        <div className="col-12 col-sm-6 form-group">
                            <label>
                                Email address (<span className="red">*</span>) :
                            </label>
                            <input
                                disabled={action === "CREATE" ? false : true}
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
                                disabled={action === "CREATE" ? false : true}
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
                            {action === "UPDATE" ? (
                                ""
                            ) : (
                                <>
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
                                            handleOnchangeInput(
                                                e.target.value,
                                                "password"
                                            )
                                        }
                                    />
                                </>
                            )}
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
                                value={userData.sex}
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
                                value={userData.group}
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
                    <Button
                        variant="secondary"
                        onClick={() => handleCloseModalUser()}
                    >
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleConfirmUser}>
                        {action === "CREATE" ? "Save" : "Update"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalUser;
