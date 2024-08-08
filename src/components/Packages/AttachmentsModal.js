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
import { deleteFile, clearCache, uploadFiles } from '../../actions/Packages/packageActions';

class AttachmentsModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            showPopover: true,
            showFineUploader: false,
            showReplaceFile: [],
        }
        uploader.methods.reset();
        uploader.params = { hostname: window.location.hostname }
        uploader.on('allComplete', () => {
            this.setState({ showFineUploader: false});
        });
        this.showHidePopover = this.showHidePopover.bind(this);
        this.resetStates = this.resetStates.bind(this);
        this.handleRemoveFileClick = this.handleRemoveFileClick.bind(this);
    }

    componentDidMount() {
        let showReplaceFile = [];
        this.props.attachments.forEach(() => {
            showReplaceFile.push(false);
        });
        this.setState({showReplaceFile: showReplaceFile});
    }

    resetStates() {
        this.setState({ showFineUploader: false, showReplaceFile: [] });
    }

    async handleRemoveFileClick(packageId, fileId, index){
        let status = await deleteFile(packageId, fileId);
        let tempList = this.props.attachments;
        if (status == 200){
            tempList.splice(index, 1);
            await clearCache();
            this.showHidePopover();
        }
        
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

    showHideReplaceFile(index) {
        let showReplaceFile = [...this.state.showReplaceFile];
        showReplaceFile[index] = !showReplaceFile[index];
        this.setState({showReplaceFile: showReplaceFile});
    }

    async handleUpload() {
       this.props.uploadFiles(this.props.packageId, uploader)
        clearCache();
    }

    async handleReplace(fileId) {
        this.props.replaceFile(this.props.packageId, fileId, uploader)
        clearCache();
    }

    showIcons(index, fileId){
        if (this.checkPermissions()){
            return (
                <span>
                    <span className='trashWrapper'>
                        <FontAwesomeIcon className="text-primary clickable" icon={faTrashAlt} id={"attachment-popover-" + index} title='Delete'/>
                        {
                        (
                            this.state.showPopover &&
                            <UncontrolledPopover flip placement='bottom' target={"attachment-popover-" + index} trigger="legacy" className='attachment-popover'>
                                <PopoverBody>
                                    <p className='confirmPopoverText'><b>Are you sure?</b></p>
                                    <FontAwesomeIcon icon={faSquareXmark} onClick={this.showHidePopover} className='text-danger xMark clickable' title='Cancel' />
                                    <FontAwesomeIcon icon={faCheckSquare} onClick={() => this.handleRemoveFileClick(this.props.packageId, fileId, index)} className='text-success checkMark clickable' title='Confirm' />
                                </PopoverBody>
                            </UncontrolledPopover>
                        )
                    }
                    </span>
                    <span className='editWrapper'>
                        <FontAwesomeIcon className="text-primary clickable" icon={faEdit} onClick={() => {this.showHideReplaceFile(index)}}  title='Edit'/>
                    </span>
                    
                </span>
                
            )
        }
    }
	
    render() {
    	return (
			<div className="attachmentsModal static-modal">
				<Modal isOpen={this.props.show} onClosed={this.resetStates}>
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
                                        <FontAwesomeIcon icon={faSquareXmark} onClick={() => {this.setState({ showFineUploader: false })}} className='text-danger xMark clickable' title='Cancel' />
                                        <FontAwesomeIcon icon={faCheckSquare} onClick={() => {this.handleUpload()}} className='text-success checkMark clickable' title='Submit'/>
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
                                {this.showIcons(index, attachment._id)}
                                <Col md={12}>
                                    {this.checkPermissions() && this.state.showReplaceFile[index] && 
                                    <div className="dropzone">
                                        <p className='mt-3 mb-2'><b>Replace this file with:</b></p>
                                        <FileDropzone 
                                            className="attachment-modal-dropzone" 
                                            uploader={uploader} 
                                            isUploading={this.props.isUploading} />
                                            <div className='text-right pt-2'>
                                                <FontAwesomeIcon icon={faSquareXmark} onClick={() => {this.showHideReplaceFile(index)}} className='text-danger xMark clickable' title='Cancel' />
                                                <FontAwesomeIcon icon={faCheckSquare} onClick={() => {this.handleReplace(attachment._id)}} className='text-success checkMark clickable' title='Submit' />
                                            </div>
                                    </div>}
                                </Col>
            			    </Row>
                            );
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
    close: PropTypes.func.isRequired,
    packageId: PropTypes.string.isRequired
};

export default AttachmentsModal;
