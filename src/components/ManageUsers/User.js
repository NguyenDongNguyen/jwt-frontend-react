import "./User.scss";
import { useEffect, useState, useRef } from "react";
import { fetchAllUser, deleteUser } from "../../services/userService";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import ModalDelete from "./ModalDelete";
import ModalUser from "./ModalUser";

const User = () => {
    const [listUsers, setListUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(4);
    const [totalPages, setTotalPages] = useState(0);
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);

    const [isShowModalUser, setIsShowModalUser] = useState(false);
    const [actionModalUser, setActionModalUser] = useState("CREATE");
    const [dataModalUser, setDataModalUser] = useState({});

    // lưu item muốn xoá ra ngoài func -> render lại UI sẽ ko bị set lại gtri
    const currentUser = useRef();

    // lưu item muốn update ra ngoài func -> render lại UI sẽ ko bị set lại gtri
    // const currentUserUpdate = useRef();

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    //call API with axios
    const fetchUsers = async () => {
        let response = await fetchAllUser(currentPage, currentLimit);
        if (response && response.data && response.data.EC === 0) {
            setTotalPages(response.data.DT.totalPages);
            setListUsers(response.data.DT.users);
        }
    };

    //change pages (thay đổi qua trang khác)
    const handlePageClick = (event) => {
        setCurrentPage(+event.selected + 1);
    };

    //show modal confirm delete
    const handleDeleteUser = async (user) => {
        //set giá trị muốn xoá cho hook useRef
        currentUser.current = user;
        setIsShowModalDelete(true);
    };

    const handleClose = () => {
        setIsShowModalDelete(false);
    };

    const confirmDeleteUser = async () => {
        let response = await deleteUser(currentUser.current);
        if (response && response.data && response.data.EC === 0) {
            toast.success(response.data.EM);
            await fetchUsers();
            setIsShowModalDelete(false);
        } else {
            toast.error(response.data.EM);
        }
    };

    const onHideModalUser = async () => {
        setIsShowModalUser(false);
        //khi ẩn modal user thì set lại data ô input bằng ''
        setDataModalUser({});
        //reset lại dữ liệu hiển thị sau khi thêm mới success
        await fetchUsers();
    };

    const handleCreateUser = () => {
        setIsShowModalUser(true);
        setActionModalUser("CREATE");
    };

    const handleEditUser = (user) => {
        //set giá trị muốn update cho hook useRef
        // currentUserUpdate.current = user;
        setActionModalUser("UPDATE");
        //fill data vào các ô input trong model user update
        setDataModalUser(user);
        setIsShowModalUser(true);
    };

    const handleRefresh = async () => {
        await fetchUsers();
    };

    return (
        <>
            <div className="container">
                <div className="manage-users-container">
                    <div className="user-header">
                        <div className="title mt-3">
                            <h3>Manage Users</h3>
                        </div>
                        <div className="actions my-3">
                            <button
                                className="btn btn-success refresh"
                                onClick={handleRefresh}
                            >
                                <i className="fa fa-refresh"></i>Refesh
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => handleCreateUser()}
                            >
                                <i className="fa fa-plus-circle"></i>Add new user
                            </button>
                        </div>
                    </div>
                    <div className="user-body">
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">No</th>
                                    <th scope="col">Id</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Username</th>
                                    <th scope="col">Group</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listUsers && listUsers.length > 0 ? (
                                    <>
                                        {listUsers.map((item, index) => (
                                            <tr key={`user ${index}`}>
                                                <td>
                                                    {(currentPage - 1) *
                                                        currentLimit +
                                                        index +
                                                        1}
                                                </td>
                                                <td>{item.id}</td>
                                                <td>{item.email}</td>
                                                <td>{item.username}</td>
                                                <td>
                                                    {item.Group
                                                        ? item.Group.name
                                                        : ""}
                                                </td>
                                                <td>
                                                    <span
                                                        title="Edit"
                                                        className="edit"
                                                        onClick={() =>
                                                            handleEditUser(item)
                                                        }
                                                    >
                                                        <i className="fa fa-pencil"></i>
                                                    </span>
                                                    <span
                                                        title="Delete"
                                                        className="delete"
                                                        onClick={() =>
                                                            handleDeleteUser(item)
                                                        }
                                                    >
                                                        <i className="fa fa-trash-o"></i>
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <tr>
                                            <td>Not found users</td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 0 && (
                        <div className="user-footer">
                            <ReactPaginate
                                nextLabel="next >"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={4}
                                marginPagesDisplayed={2}
                                pageCount={totalPages}
                                previousLabel="< previous"
                                pageClassName="page-item"
                                pageLinkClassName="page-link"
                                previousClassName="page-item"
                                previousLinkClassName="page-link"
                                nextClassName="page-item"
                                nextLinkClassName="page-link"
                                breakLabel="..."
                                breakClassName="page-item"
                                breakLinkClassName="page-link"
                                containerClassName="pagination"
                                activeClassName="active"
                                renderOnZeroPageCount={null}
                            />
                        </div>
                    )}
                </div>
            </div>

            <ModalDelete
                show={isShowModalDelete}
                handleClose={handleClose}
                confirmDeleteUser={confirmDeleteUser}
            />

            <ModalUser
                onHide={onHideModalUser}
                show={isShowModalUser}
                action={actionModalUser}
                // data để fill vào các ô input modal user update
                dataModalUser={dataModalUser}
            />
        </>
    );
};

export default User;
