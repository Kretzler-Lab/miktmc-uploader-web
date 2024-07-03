import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, Col, Row, UncontrolledPopover, PopoverBody } from 'reactstrap';
import filesize from 'filesize';
import { shouldColorRow } from './attachmentsModalRowHelper';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faCheckSquare, faSquareXmark } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

class AttachmentsModal extends Component {
    constructor(props){
        super(props);
        this.state = {showPopover: true}
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
        
        if (this.props.currentUser.email == this.props.packageSubmitter.email || this.props.currentUser.roles.includes("uploader_admin")){
            return (
                <span>
                    <span className='trashWrapper'>
                        <FontAwesomeIcon className="text-primary clickable" icon={faTrashAlt} id={"attachment-popover-" + index}/>
                    </span>
                    <span className='editWrapper'>
                        <FontAwesomeIcon className="text-primary clickable" icon={faEdit} />
                    </span>
                    {
                        (
                            this.state.showPopover &&
                            <UncontrolledPopover flip placement='bottom' target={"attachment-popover-" + index} trigger="legacy">
                                <PopoverBody>
                                    <p className='confirmPopoverText'><b>Are you sure?</b></p>
                                    <FontAwesomeIcon icon={faSquareXmark} onClick={this.showHidePopover} className='text-danger xMark clickable' />
                                    <FontAwesomeIcon icon={faCheckSquare} className='text-success checkMark clickable' />
                                </PopoverBody>
                            </UncontrolledPopover>
                        )
                    }
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
	            	</ModalHeader>
            		<ModalBody className="attachmentsModalBody">
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
    packageSubmitter: PropTypes.string.isRequired,
    attachments: PropTypes.array.isRequired,
    show: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired
};

export default AttachmentsModal;
