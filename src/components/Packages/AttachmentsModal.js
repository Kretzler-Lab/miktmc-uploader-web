import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, Col, Row } from 'reactstrap';
import filesize from 'filesize';
import { shouldColorRow } from './attachmentsModalRowHelper';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

class AttachmentsModal extends Component {
    showIcons(){
        
        if (this.props.currentUser.email == this.props.packageSubmitter.email || this.props.currentUser.roles[0] == "uploader_admin"){
            return (
                <div>
                    <div className='trashWrapper'>
                        <FontAwesomeIcon className="text-primary" icon={faTrashAlt} />
                    </div>
                    <div className='editWrapper'>
                        <FontAwesomeIcon className="text-primary" icon={faEdit} />
                    </div>
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
            				<Col md={6} className="filename"><span>{attachment.fileName}</span></Col>
            				<Col md={3}> {filesize(attachment.size)}</Col>
                            <Col md={3}>{this.showIcons()}</Col>
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
