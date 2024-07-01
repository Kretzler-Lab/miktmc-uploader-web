import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Component } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";






class ConfirmationModal extends Component{
    render() {
        return (
            <div className="confirmationModal">
                <Modal isOpen={this.props.show}>
                    <ModalHeader toggle={this.props.close} />
                    <ModalBody>
                        <strong>Are you sure?</strong>
                        <button onClick={this.props.close}><FontAwesomeIcon icon="fa-solid fa-square-xmark" /></button>
                        <FontAwesomeIcon icon="fa-solid fa-square-check" />
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}


ConfirmationModal.propTypes = {
    show: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired
}
export default ConfirmationModal;