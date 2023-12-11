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

    // lưu item muốn xoá ra ngoài func -> render lại UI sẽ ko bị set lại gtri
    const currentUser = useRef();

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

    return (
        <>
            <div className="container">
                <div className="manage-users-container">
                    <div className="user-header">
                        <div className="title">
                            <h3>Table Users</h3>
                        </div>
                        <div className="actions">
                            <button className="btn btn-success">Refesh</button>
                            <button className="btn btn-primary">Add new user</button>
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
                                                <td>{index + 1}</td>
                                                <td>{item.id}</td>
                                                <td>{item.email}</td>
                                                <td>{item.username}</td>
                                                <td>
                                                    {item.Group
                                                        ? item.Group.name
                                                        : ""}
                                                </td>
                                                <td>
                                                    <button className="btn btn-warning mx-3">
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() =>
                                                            handleDeleteUser(item)
                                                        }
                                                    >
                                                        Delete
                                                    </button>
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

            <ModalUser title={"Create new user"} />
        </>
    );
};

export default User;
