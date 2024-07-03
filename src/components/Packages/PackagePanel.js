import React, { Component } from 'react';
import { Col, Row, Button, UncontrolledPopover, PopoverBody } from 'reactstrap';
import { getLocalDateString, getLocalTimeString } from '../../helpers/timezoneUtil';
import { shouldColorRow } from './attachmentsModalRowHelper.js';
import { getDataTypeIconInfo } from './dataTypeIconHelper.js';
import AttachmentsModal from './AttachmentsModal';
import MetadataModal from './MetadataModal';
import LargeFileModal from './LargeFileModal';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import PackagePanelStateText from './PackagePanelStateText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faLock, faLockOpen, faSquareXmark } from '@fortawesome/free-solid-svg-icons';

class PackagePanel extends Component {

	constructor(props) {
		super(props);
		this.state = { showAttachments: false, showMetadata: false, showLargeFile: false, showPopover: true};
		this.handleAttachmentClick = this.handleAttachmentClick.bind(this);
		this.handleMetadataClick = this.handleMetadataClick.bind(this);
		this.handleLargeFileClick = this.handleLargeFileClick.bind(this);
		this.handleStateInfoClick = this.handleStateInfoClick.bind(this);
		this.handleLockPackageClick = this.handleLockPackageClick.bind(this);
		this.showHidePopover = this.showHidePopover.bind(this);
	}
	
	handleAttachmentClick() {
		let show = !this.state.showAttachments;
		this.setState({ showAttachments: show });
	}

	handleMetadataClick() {
		let show = !this.state.showMetadata;
		this.setState({ showMetadata: show });
	}

	handleLargeFileClick() {
		let show = !this.state.showLargeFile;
		this.setState({ showLargeFile: show });
	}

	handleStateInfoClick() {
		if (this.props.uploadPackage.state.state === 'METADATA_RECEIVED') {
			let show = !this.state.showLargeFile;
			this.setState({ showLargeFile: show });
		}
	}

	handleLockPackageClick(packageId) {
		console.log("lock package " + packageId);
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

	render() {
		
		let packageInfo = this.props.uploadPackage.packageInfo;
		let packageTypeIcons = this.props.packageTypeIcons;
		let submittedDate = getLocalDateString(packageInfo.createdAt);
		let submittedTime = getLocalTimeString(packageInfo.createdAt);
		let { iconDataType, iconImage } = getDataTypeIconInfo(packageTypeIcons, packageInfo.packageType);

		return (
			<section className='package'>
				<Row className={
						(shouldColorRow(this.props.index) ? 'bg-light ' : ' ') +
						'border rounded no-gutters px-2 py-2 mx-2 my-2'}>
					<Col xs={12} md={9} className='media align-items-center'>
						<img src={'img/' + iconImage} alt={iconDataType} height='80px' />
						<Row className='media-body mx-2 d-flex align-items-center'>
							<Col xs={12} className='pb-1'><b>{packageInfo.subjectId}</b></Col>
							<Col xs={12} className='pb-1'>{packageInfo.packageType}</Col>
							<Col xs={12}>Submitted <b>{submittedDate}</b> at {submittedTime} by {packageInfo.submitter.firstName} {packageInfo.submitter.lastName}, {packageInfo.siteName}</Col>
							<Col xs={12} className='pb-1'>Upload ID: {packageInfo._id}</Col>
							<Col xs={12} className='pb-1'>Biopsy ID: {packageInfo.biopsyId}</Col>
						</Row>
					</Col>
					<Col xs={12} md={3}>
						<Row>
							<Col xs={4} md={10} lg={8}>
								{/* eslint-disable-next-line */} 
								<a onClick={this.handleAttachmentClick}>{packageInfo.files.length} attachment(s)</a>
							</Col>
							{
								(this.props.userInformation?.roles.includes("uploader_admin")) &&
								<Col xs={4} md={2} lg={4} className='text-center'>
										{	
											(this.props.uploadPackage.state.state !== "UPLOAD_LOCKED") ? 
											(
												<div>
													<FontAwesomeIcon className='text-primary clickable' id={"Popover-" + this.props.index} icon={faLockOpen} />
													{
														(this.state.showPopover &&
														<UncontrolledPopover 
															placement="bottom" 
															target={"Popover-" + this.props.index} 
															trigger="legacy"
															modifiers={{
																preventOverflow: {enabled: false},
																hide: {enabled: false},
																flip: {enabled: false}
															}} >
															<PopoverBody>
																<p className='confirmPopoverText'><b>Are you sure?</b></p>
																<FontAwesomeIcon icon={faSquareXmark} onClick={this.showHidePopover} className='text-danger xMark clickable' />
																<FontAwesomeIcon icon={faCheckSquare} onClick={() => {this.handleLockPackageClick(packageInfo._id)}} className='text-success checkMark clickable' />
															</PopoverBody>
														</UncontrolledPopover>)
													}
												</div>
											)
											: (<FontAwesomeIcon className='text-dark' icon={faLock} />)
										}
								</Col>
							}
							<Col xs={4} md={12}>
								{/* eslint-disable-next-line */} 
								<a className='d-block pb-1' onClick={this.handleMetadataClick}>Show upload metadata</a>
							</Col>
							{this.props.uploadPackage.state &&
							<Col xs={4} md={12} className='mb-1'>
								<PackagePanelStateText
									handleStateInfoClick={this.handleStateInfoClick}
									panelState={this.props.uploadPackage.state}
									currentUser={this.props.userInformation}
									packageSubmitter={packageInfo.submitter}
									largeFileUpload={packageInfo.largeFilesChecked}
									stateDisplayMap={this.props.stateDisplayMap}
								/>
							</Col>
							}
							{
								(this.props.userInformation?.roles.includes("uploader_admin")) &&
								(this.props.uploadPackage.state.state !== "UPLOAD_LOCKED") &&
								<Col xs={4} md={12} className='mb-1' >
									<Link to="/" className="d-block-inline">
										<Button 
											color="primary"
											className="btn-sm packages-button-open-folder">
											Open Folder
										</Button>
									</Link>
								</Col>
							}
					   </Row>
				   </Col>
				</Row>
				
				<AttachmentsModal currentUser={this.props.userInformation} packageSubmitter={packageInfo.submitter} show={this.state.showAttachments} attachments={packageInfo.files} close={this.handleAttachmentClick}/>
				<MetadataModal show={this.state.showMetadata} uploadPackage={packageInfo} close={this.handleMetadataClick} dtds={this.props.dtds}/>
				<LargeFileModal show={this.state.showLargeFile} close={this.handleLargeFileClick} link={this.props.uploadPackage.state ? this.props.uploadPackage.state.codicil: ''}/>
			</section>
		);
	}
}

PackagePanel.propTypes = {
	uploadPackage: PropTypes.object.isRequired,
	packageTypeIcons: PropTypes.array.isRequired,
	dtds: PropTypes.object.isRequired,
	userInformation: PropTypes.object.isRequired,
	stateDisplayMap: PropTypes.object.isRequired
}

export default PackagePanel;
