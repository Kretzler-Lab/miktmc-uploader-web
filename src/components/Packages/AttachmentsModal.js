import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, Col, Row, Button, UncontrolledPopover, PopoverBody } from 'reactstrap';
import filesize from 'filesize';
import { shouldColorRow } from './attachmentsModalRowHelper';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faCheckSquare, faSquareXmark } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import FileDropzone from '../Upload/Forms/FileDropzone';
import { uploader } from '../Upload/fineUploader';

class AttachmentsModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            showPopover: true,
            showFineUploader: false
        }
        uploader.methods.reset();
        uploader.params = { hostname: window.location.hostname }
        this.showHidePopover = this.showHidePopover.bind(this);
    }

    checkPermissions() {
        return (
            this.props.packageState !== "UPLOAD_LOCKED" && 
            (this.props.currentUser.email == this.props.packageSubmitter.email || 
            this.props.currentUser.roles.includes("uploader_admin"))
        );
    }

    showHidePopover() {
		this.setState(previousState => ({ 
			showPopover: !previousState.showPopover 
		}), () => {
			this.setState(previousState => ({
				showPopover: !previousState.showPopover
			}));
		}); 
	}

    showIcons(index){
        
        if (this.checkPermissions()){
            return (
                <span>
                    <span className='trashWrapper'>
                        <FontAwesomeIcon className="text-primary clickable" icon={faTrashAlt} id={"attachment-popover-" + index}/>
                        {
                        (
                            this.state.showPopover &&
                            <UncontrolledPopover flip placement='bottom' target={"attachment-popover-" + index} trigger="legacy" className='attachment-popover'>
                                <PopoverBody>
                                    <p className='confirmPopoverText'><b>Are you sure?</b></p>
                                    <FontAwesomeIcon icon={faSquareXmark} onClick={this.showHidePopover} className='text-danger xMark clickable' />
                                    <FontAwesomeIcon icon={faCheckSquare} className='text-success checkMark clickable' />
                                </PopoverBody>
                            </UncontrolledPopover>
                        )
                    }
                    </span>
                    <span className='editWrapper'>
                        <FontAwesomeIcon className="text-primary clickable" icon={faEdit} />
                    </span>
                    
                </span>
                
            )
        }
    }
	
    render() {
    	return (
			<div className="attachmentsModal static-modal">
				<Modal isOpen={this.props.show}>
					<ModalHeader toggle={this.props.close}>
	            		Attached Files
                        {!this.state.showFineUploader && this.checkPermissions() && 
                        <Button onClick={() => {this.setState({ showFineUploader: true })}}
                            color="primary"
                            className="btn-sm add-files-button ml-3">
                            Add Files
                        </Button> }
	            	</ModalHeader>
            		<ModalBody className="attachmentsModalBody">
                            {this.state.showFineUploader && this.checkPermissions() &&
                            <div className="dropzone">
                                <p className='mt-3 mb-2'><b>Add files to this package:</b></p>
                                <FileDropzone 
                                    className="attachment-modal-dropzone" 
                                    uploader={uploader} 
                                    isUploading={this.props.isUploading} />
                                    <div className='text-right pt-2'>
                                        <FontAwesomeIcon icon={faSquareXmark} onClick={() => {this.setState({ showFineUploader: false })}} className='text-danger xMark clickable' />
                                        <FontAwesomeIcon icon={faCheckSquare} onClick={() => {}} className='text-success checkMark clickable' />
                                    </div>
                            </div>}
            		{this.props.attachments.map((attachment, index) => {
            			let rowClass = "attachmentsModalRow";
            			if (shouldColorRow(index)) {
            				rowClass +=" grayRow";
            			}
            			return (
                            <Row key={index} className={rowClass}>
            				<Col md={7} className="filename"><span>{attachment.fileName}</span></Col>
            				<Col md={3} className="text-right"> {filesize(attachment.size)}</Col>
                            {this.showIcons(index)}
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
    packageSubmitter: PropTypes.object.isRequired,
    packageState: PropTypes.string.isRequired,
    attachments: PropTypes.array.isRequired,
    show: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired
};

export default AttachmentsModal;
