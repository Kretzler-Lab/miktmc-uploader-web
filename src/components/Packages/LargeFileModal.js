import React, { Component } from 'react';
import {Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap';
import PropTypes from 'prop-types';
import {Button} from "antd";

class LargeFileModal extends Component {

    render() {
        return (
            <div className="largeFileModal static-modal">
                <Modal size="lg" isOpen={this.props.show}>
                    <ModalHeader toggle={this.props.close}>
                        Upload Instructions
                    </ModalHeader>
                    <ModalBody className="largeFileModalBody">
                        <ol>
                            <li>Click this link to <a href={this.props.link} target="_blank" rel="noopener noreferrer">open the destination folder</a> on the Globus endpoint</li>
                            <li>Upload your files using the Globus file manager. </li>
                            <li>Email <a target="_blank" rel="noopener noreferrer" href="mailto:datalakeuploadersupport@kpmp.org">datalakeuploadersupport@kpmp.org</a> to let us know you have finished uploading your file(s).</li>
                        </ol>
                        <hr/>
                        <p><strong>PLEASE NOTE:</strong> This method requires you to <a href="https://www.globus.org/globus-connect-personal" target="_blank" rel="noopener noreferrer">install Globus Connect Personal</a> in order to upload your file(s) to the data lake.</p>
                        <p>You will need to log in to use the Globus Web App and create a collection for your data source. For help or more information, see: <a href="https://docs.globus.org/how-to/get-started/" target="_blank" rel="noopener noreferrer"> How To Log In and Transfer Files with Globus</a></p>
                    </ModalBody>
                    <ModalFooter>
                        <article id="largeFileModalFooter" className="justify-content-right">
                            <Button type="primary" id="largeFileButton" onClick={this.props.close}>OK</Button>
                        </article>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

LargeFileModal.propTypes = {
    show: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired
};

export default LargeFileModal;