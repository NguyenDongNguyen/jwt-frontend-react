import "./GroupRole.scss";
import { useEffect, useState } from "react";
import { fetchGroup } from "../../services/userService";
import { fetchAllRole, fetchRolesByGroup } from "../../services/roleService";

import { toast } from "react-toastify";
import { values } from "lodash";

const GroupRole = () => {
    const [userGroups, setUserGroups] = useState([]);
    const [listRoles, setListRoles] = useState([]);
    const [selectGroup, setSelectGroup] = useState("");
    const [assignRolesByGroup, setAssignRolesByGroup] = useState([]);
    // vào modal user create lần đầu
    useEffect(() => {
        getGroup();
        getAllRoles();
    }, []);

    // lấy data group từ DB để set vào form select
    const getGroup = async () => {
        let res = await fetchGroup();
        if (res && res.EC === 0) {
            setUserGroups(res.DT);
        } else {
            toast.error(res.EM);
        }
    };

    const getAllRoles = async () => {
        let data = await fetchAllRole();
        if (data && +data.EC === 0) {
            setListRoles(data.DT);
        }
    };

    const handleOnchangeGroup = async (value) => {
        setSelectGroup(values);
        if (value) {
            let data = await fetchRolesByGroup(value);
            if (data && +data.EC === 0) {
                let result = buildDataRolesByGroup(data.DT.Roles, listRoles);
                setAssignRolesByGroup(result);
            }
        }
    };

    //ktra role nào đã đc gán cho group đó rồi thì checked = true
    const buildDataRolesByGroup = (groupRoles, allRoles) => {
        let result = [];
        if (allRoles && allRoles.length > 0) {
            allRoles.map((role) => {
                let object = {};
                object.url = role.url;
                object.id = role.id;
                object.description = role.description;
                object.isAssigned = false;
                if (groupRoles && groupRoles.length > 0) {
                    object.isAssigned = groupRoles.some(
                        (item) => item.url === object.url
                    );
                }

                result.push(object);
            });
        }
        return result;
    };

    // handle khi tích chọn hoặc huỷ tích chọn role
    const handleSelectRole = (value) => {
        const _assignRolesByGroup = [...assignRolesByGroup];
        let foundIndex = _assignRolesByGroup.findIndex(
            (item) => +item.id === +value
        );
        if (foundIndex > -1) {
            _assignRolesByGroup[foundIndex].isAssigned =
                !_assignRolesByGroup[foundIndex].isAssigned;
        }
        setAssignRolesByGroup(_assignRolesByGroup);
    };

    return (
        <div className="group-role-container">
            <div className="container">
                <div className="container mt-3">
                    <h4>Group Role:</h4>
                    <div className="assign-group-role">
                        <div className="col-12 col-sm-6 form-group">
                            <label>
                                Select Group: : (<span className="red">*</span>)
                            </label>
                            <select
                                className="form-select"
                                onChange={(e) => handleOnchangeGroup(e.target.value)}
                            >
                                <option value="">Please select your group</option>
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
                        <hr />
                        {selectGroup && (
                            <div className="roles">
                                <h5>Assign Roles</h5>
                                {assignRolesByGroup &&
                                    assignRolesByGroup.length > 0 &&
                                    assignRolesByGroup.map((item, index) => {
                                        return (
                                            <div
                                                className="form-check"
                                                key={`list-role-${index}`}
                                            >
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value={item.id}
                                                    id={`list-role-${index}`}
                                                    checked={item.isAssigned}
                                                    onChange={(e) =>
                                                        handleSelectRole(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor={`list-role-${index}`}
                                                >
                                                    {item.url}
                                                </label>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                        <div className="mt-3">
                            <button className="btn btn-warning">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupRole;
