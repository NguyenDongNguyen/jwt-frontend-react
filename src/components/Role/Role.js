import { useState, useRef } from "react";
import "./Role.scss";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { createRoles } from "../../services/roleService";
import TableRole from "./TableRole";

const Role = () => {
    const childRef = useRef();
    const dataChildDefault = { url: "", description: "", isValidUrl: true };

    const [listChilds, setListChilds] = useState({
        child1: dataChildDefault,
    });

    const handleOnchangeInput = (name, value, key) => {
        let _listChilds = { ...listChilds };
        _listChilds[key][name] = value;

        // reset valid nếu filed đó có dữ liệu
        if (value && name === "url") {
            _listChilds[key]["isValidUrl"] = true;
        }
        setListChilds(_listChilds);
    };

    const handleAddNewInput = () => {
        let _listChilds = { ...listChilds };
        _listChilds[`child-${uuidv4()}`] = dataChildDefault;
        setListChilds(_listChilds);
    };

    const handleDeleteInput = (key) => {
        let _listChilds = { ...listChilds };
        delete _listChilds[key];
        setListChilds(_listChilds);
    };

    // chuyển dlieu sang array và chỉ lấy url, description
    const buildDataToPersist = () => {
        let _listChilds = { ...listChilds };
        const result = [];
        Object.entries(_listChilds).map(([key, child], index) => {
            result.push({
                url: child.url,
                description: child.description,
            });
        });
        return result;
    };

    const handleSave = async () => {
        let invalidObj = Object.entries(listChilds).find(([key, child], index) => {
            return child && !child.url;
        });

        console.log(">>> check valid: ", invalidObj);

        if (!invalidObj) {
            //call api
            let data = buildDataToPersist();
            let res = await createRoles(data);
            if (res && res.EC === 0) {
                toast.success(res.EM);
                //reset lại form input về default
                setListChilds({ child1: dataChildDefault });
                // use useRef để gọi hàm getAllRoles từ thèn con ngược lên cha
                childRef.current.fetListRolesAgain();
            }
        } else {
            toast.error("Input URL must not be empty");
            let _listChilds = { ...listChilds };
            const key = invalidObj[0];
            _listChilds[key]["isValidUrl"] = false;
            setListChilds(_listChilds);
        }
    };

    return (
        <div className="role-container">
            <div className="container">
                <div className="adding-roles mt-3">
                    <div className="title-role">
                        <h4>Add a new role...</h4>
                    </div>
                    <div className="role-parent">
                        {Object.entries(listChilds).map(([key, child], index) => {
                            return (
                                <div className="row row-child" key={key}>
                                    <div className="col-5 form-group">
                                        <label>URL:</label>
                                        <input
                                            type="text"
                                            className={
                                                child.isValidUrl
                                                    ? "form-control"
                                                    : "form-control is-invalid"
                                            }
                                            value={child.url}
                                            onChange={(e) =>
                                                handleOnchangeInput(
                                                    "url",
                                                    e.target.value,
                                                    key
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="col-5 form-group">
                                        <label>Description:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={child.description}
                                            onChange={(e) =>
                                                handleOnchangeInput(
                                                    "description",
                                                    e.target.value,
                                                    key
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="col-2 mt-4 actions">
                                        <i
                                            className="fa fa-plus-circle add"
                                            onClick={handleAddNewInput}
                                        ></i>
                                        {index >= 1 && (
                                            <i
                                                className="fa fa-trash-o delete"
                                                onClick={() =>
                                                    handleDeleteInput(key)
                                                }
                                            ></i>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        <div>
                            <button
                                className="btn btn-warning mt-3"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="mt-3 table-role">
                    <h4>List Current Roles: </h4>
                    <TableRole ref={childRef} />
                </div>
            </div>
        </div>
    );
};

export default Role;
