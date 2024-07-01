import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import PropTypes from 'prop-types';




class ConfirmationModal extends Component {
    render() {
        return (
            <div className="confirmationModal">
                <strong>Are you sure?</strong>
                <button onClick={this.props.close}><FontAwesomeIcon icon="fa-solid fa-square-xmark" /></button>
                <FontAwesomeIcon icon="fa-solid fa-square-check" />
            </div>
        )
    }
}


ConfirmationModal.propTypes = {
    show: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired
}
export default ConfirmationModal;