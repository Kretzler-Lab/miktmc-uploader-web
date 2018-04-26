import React, { Component } from 'react'
import { Modal, Button, ButtonGroup, ControlLabel } from 'react-bootstrap';
import FineUploaderTraditional from 'fine-uploader-wrappers'
import qq from 'fine-uploader/lib/core'
import Gallery from 'react-fine-uploader'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import FileList from './FileList';
import UploadPackageInfoForm from './UploadPackageInfoForm';
import ReviewUpload from './ReviewUpload';

const BASE_URL = (process.env.REACT_APP_ENVIRONMENT === 'production' ? 'http://upload.kpmp.org' : 'http://localhost') + ':3030';

const ReviewPanel = ({ props }) => {
    const { form, changeUploadTab, showUploadModal, processUpload, fileList, cancel } = props;

    if (!form.uploadPackageInfoForm || !form.uploadPackageInfoForm.values) {
        return (<p><em>Please define your upload first and then attach files.</em></p>);
    }

    const values = form.uploadPackageInfoForm.values;
 
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="modalTitle">Review Upload</div>
                </div>
            </div>
            <div className="row">
                <div className="col-4">
                    <strong>Name:</strong>
                </div>
                <div className="col-8">
                    <span>{ values.firstName} { values.lastName }</span>
                </div>
            </div>
            <div className="row">
                <div className="col-4">
                    <strong>Institution:</strong>
                </div>
                <div className="col-8">
                    { values.institutionName }
                </div>
            </div>
            <div className="row">
                <div className="col-4">
                    <strong>Package Type:</strong>
                </div>
                <div className="col-8">
                    { values.packageType }
                </div>
            </div>
            <div className="row">
                <div className="col-4">
                    <strong>Experiment #:</strong>
                </div>
                <div className="col-8">
                    { values.experimentId }
                </div>
            </div>
            <div className="row">
                <div className="col-4">
                    <strong>Subject #:</strong>
                </div>
                <div className="col-8">
                    { values.subjectId }
                </div>
            </div>
            <div className="row">
                <div className="col-4">
                    <strong>Experiment Date:</strong>
                </div>
                <div className="col-8">
                    { values.experimentDate }
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <FileList files={ fileList } />
                </div>
            </div>
            <ReviewUpload changeUploadTab={changeUploadTab} showUploadModal={showUploadModal} processUpload={processUpload} cancel={cancel} />
        </div>
    );
};

class UploadTab extends Component {

	constructor(props) {
		super();
		this.uploader = new FineUploaderTraditional({
		    options: {
		        debug: true,
		        autoUpload: true,
		        maxConnections: 3,
		        chunking: {
		            enabled: true
		        },
		        request: {
		            endpoint: BASE_URL + '/upload'
		        },
		        retry: {
		            enableAuto: false
		        },
		        callbacks: {
		        		onAllComplete: function(success, failure) {
		        			props.showUploadModal(false);
		        			props.viewUploadedFiles();
		        		},
		        		onError: function(fileId, filename, errorReason, xhr) {
		        			// for some reason we always get an undefined file here, so we are just ignoring it for now.
		        			if (filename !== undefined) {
		        				alert("We encountered an error uploading file: " + filename + "\n With reason: " + errorReason);
		        				this.methods.clearStoredFiles();
		        				this.methods.reset();
		        				props.showUploadModal(false);
		        			}
		        		}
		        }
		    }
		});
	}
	
    componentDidMount() {
        this.uploader.on('submit', (id, name) => {
            if (this.uploader.methods.getUploads({
                status: [ qq.status.SUBMITTING, qq.status.SUBMITTED, qq.status.PAUSED ]
            }).length > 1 && this.props.currentTab === 1) {
                alert("Please upload and attach one file at a time.");
                return false;
            }

            return true;
        });
        this.uploader.on('upload', (id, name) => {
            if (this.props.currentTab === 2) {
                return true;
            }

            return { pause: true };
        });
    }

    componentDidUpdate() {
        if (this.props.packageInfo) {
            this.uploader.methods.reset();

            this.props.fileList.forEach((file, id) => {
                this.uploader.methods.setParams({ fileMetadata: file.fileMetadata, ...this.props.packageInfo }, id);
                this.uploader.methods.addFiles([this.props.fileList[id].file]);
            });

            this.uploader.methods.uploadStoredFiles();
           
        }
    }

    attachFiles = () => {
        var files = this.uploader.methods.getUploads({
            status: [ qq.status.SUBMITTED, qq.status.PAUSED ]
        });

        if (files.length) {
            var file = files.pop();

            file.fileMetadata = this.props.fileDescription;
            this.uploader.methods.cancel(file.id);
            this.props.appendToFileList(file);
            this.props.updateFileDescription("");

            return;
        }
        
        alert("Please add another file to attach.");
    };

    handleFileDescriptionChange = (event) => {
        this.props.updateFileDescription(event.target.value);
    };
    
    cancel = () => {
    		this.uploader.methods.cancelAll();
    		this.uploader.methods.clearStoredFiles(); 
    		this.uploader.methods.reset(); 
    		this.props.showUploadModal(false);
    		this.props.clearFileList();
    }

    render() {
        return (
            <div className="static-modal">
                <Modal.Dialog>
                    <Modal.Body className="uploadFilesContainer">
                        <Tabs selectedIndex={this.props.currentTab} onSelect={tabIndex => this.props.changeUploadTab(tabIndex)} forceRenderTabPanel={true}>
                            <TabList>
                                <Tab>1: Define Upload</Tab>
                                <Tab>2: Attach Files</Tab>
                                <Tab>3: Review Upload</Tab>
                            </TabList>
                            <TabPanel>
                                <UploadPackageInfoForm uploadPackageInfo={this.props.uploadPackageInfo} changeUploadTab={this.props.changeUploadTab} showUploadModal={this.props.showUploadModal} onSubmit={data => { this.props.uploadPackageInfo(data) }} cancel={this.cancel} />
                            </TabPanel>
                            <TabPanel>
                                <div>
                                    <div className="modalTitle">Select File(s)</div>
                                    <Gallery fileInput-multiple={ false } uploader={ this.uploader } />
                                    <div className="form-group">
                                        <ControlLabel htmlFor="fileDescription">Description* <i>(each file requires a description)</i></ControlLabel>
                                        <textarea className="form-control" cols="63" row="6" onChange={this.handleFileDescriptionChange} id="fileDescription" name="fileDescription" placeholder="Please describe this file." value={this.props.fileDescription}></textarea>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 text-center">
                                            <Button type="submit" className="btn-outline-dark" onClick={() => this.attachFiles()}>Attach</Button>
                                        </div>
                                    </div>
                                    <div>
                                        <span>Attached Files</span>
                                        <FileList files={this.props.fileList} />
                                    </div>
                                </div>
                                <hr/>
                                <div>
                                    <div className="row">
                                        <div className="col-6 float-left">
                                            <Button className="btn-outline-dark" bsStyle="default" onClick={() => this.cancel(this.uploader, this.props)}>Cancel</Button>
                                        </div>
                                        <div className="col-6">
                                        		<ButtonGroup className="float-right">
                                        			<Button className="btn-outline-dark" onClick={() => this.props.changeUploadTab(0)}>Back</Button>
                                        			&nbsp;
                                        			<Button bsStyle="primary" onClick={() => this.props.changeUploadTab(2)}>Next</Button>
                                            	</ButtonGroup>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <ReviewPanel props={ this.props } />
                            </TabPanel>
                        </Tabs>
                    </Modal.Body>
                </Modal.Dialog>
            </div>
        )
    }
}

export default UploadTab