import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, Col, Row } from 'reactstrap';
import filesize from 'filesize';
import { shouldColorRow } from './attachmentsModalRowHelper';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class AttachmentsModal extends Component {
    showIcons(){
        
        if (this.props.currentUser.email == this.props.packageSubmitter.email || this.props.currentUser.roles[0] == "uploader_admin"){
            console.log("I should be showing things")
            console.log(this.props.currentUser)
            console.log(this.props.packageSubmitter)
            console.log(this.props.currentUser.roles[0])
            return (
                <div>
                    <Col md={3}><FontAwesomeIcon icon="fas fa-edit" /></Col>
                    <Col md={3}><FontAwesomeIcon icon="fas fa-trash-alt" /></Col>
                </div>
                
            )
        }
    }
	
    render() {
    	return (
			<div className="attachmentsModal static-modal">
				<Modal isOpen={this.props.show}>
					<ModalHeader toggle={this.props.close}>
	            		Attached Files
	            	</ModalHeader>
            		<ModalBody className="attachmentsModalBody">
            		{this.props.attachments.map((attachment, index) => {
            			let rowClass = "attachmentsModalRow";
            			if (shouldColorRow(index)) {
            				rowClass +=" grayRow";
            			}
            			return (
                            <Row key={index} className={rowClass}>
            				<Col md={9} className="filename"><span>{attachment.fileName}</span></Col>
            				<Col md={3}>{filesize(attachment.size)}</Col>
                            {this.showIcons()}
            			</Row>);
            		})}
            		</ModalBody>
				</Modal>
			</div>
    	);
          
    }
}

AttachmentsModal.propTypes = {
    currentUser: PropTypes.object.isRequired,
    packageSubmitter: PropTypes.string.isRequired,
    attachments: PropTypes.array.isRequired,
    show: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired
};

export default AttachmentsModal;
