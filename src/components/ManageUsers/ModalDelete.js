import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

// Modal confirm Delete (xác nhận chắc chắn muốn xoá hay ko)
const ModalDelete = (props) => {
    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn xoá ?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={props.confirmDeleteUser}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalDelete;
