import React, { Component } from 'react';
import { Form, Button } from 'antd';
import { DynamicFormGenerator } from './DynamicFormGenerator';
import { Row, Col } from 'reactstrap';
import FileDropzone from './FileDropzone';
import qq from 'fine-uploader/lib/core';
import { uploader } from '../fineUploader';
import { Link, Prompt } from 'react-router-dom';
import PropTypes from 'prop-types';

class DynamicForm extends Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			filesAdded: 0,
			submitClicked: false,
		};
		
		uploader.methods.reset();
		uploader.params = { hostname: window.location.hostname }

		uploader.on('submit', () => {
			let newCount = this.state.filesAdded + 1;
			this.setState( { filesAdded: newCount } );
			this.isSubmitDisabled();
			return true;
		});

		uploader.on('cancel', () => {
			let newCount = this.state.filesAdded - 1;
			this.setState( { filesAdded: newCount });
			this.isSubmitDisabled();
			return true;
		});

		uploader.on('submit', (id, name) => {
			let files = uploader.methods.getUploads({
			status: [ qq.status.SUBMITTED, qq.status.PAUSED ]});

			// The new version of react-scripts sees fileIndex as an unused variable, 
			// though it is...adding a comment to disable erroneous warning
			// eslint-disable-next-line
			for(let fileIndex in files) {
				let existingName = files[fileIndex].name;
				if (existingName === name) {
					alert("You have already selected " + existingName + " to upload.");
					return false;
				}
			}
			return true;
		});

		uploader.on('validateBatch', () => {
			if (this.state.submitClicked) {
				return false;
			}
			return true;
		})

		let formGenerator = new DynamicFormGenerator();
		this.renderSection = formGenerator.renderSection.bind(this);
		this.renderField = formGenerator.renderField.bind(this);
		this.isFieldDisabled = formGenerator.isFieldDisabled.bind(this);
	}

	componentDidMount() {
		if(!this.isRemoteDataLoaded()) {
			this.props.loadRemoteData();
		}
	}

	isRemoteDataLoaded() {
		return Object.keys(this.props.formDTD).length !== 0
			&& this.props.formDTD.constructor === Object;
	}
	
	handleSubmit = (e) => {
		this.setState({submitClicked: true});
		let { validateFields } = this.props.form;
		validateFields((err, values) => {
			let newValues = JSON.parse(JSON.stringify(values).replace(/"\s+|\s+"/g,'"'));
			if (!this.needUserInfo()) {
				newValues.submitterFirstName = this.props.userInformation.firstName;
				newValues.submitterLastName = this.props.userInformation.lastName;
				newValues.submitterEmail = this.props.userInformation.email;
			}
			newValues.version = this.props.formDTD.version;
			newValues.datasetInformationVersion = this.props.formDTD.standardFields.version;
			newValues.packageTypeMetadataVersion = this.determinePackageTypeMetadataVersion();
            if(!err) {
				this.props.postPackageInformation(newValues, uploader);
			} else {
				console.log("Received err: ", err);
				throw new Error("Unable to submit form: ", err);
			}
		});
	}
	
	determinePackageTypeMetadataVersion= () => {
		let { getFieldValue } = this.props.form; 
		let dynamicFormElements = this.props.formDTD.typeSpecificElements.filter(function(element) { return element.hasOwnProperty(getFieldValue('packageType')) });
		if (dynamicFormElements.length > 0) {
			dynamicFormElements = dynamicFormElements[0][getFieldValue('packageType')];
			return dynamicFormElements.version;
		}
		return undefined;
	}
	
	needUserInfo() {
		let submitterFirstBlank = this.props.userInformation.firstName === "";
		let submitterLastNameBlank = this.props.userInformation.lastName === "";
		let submitterEmailBlank = this.props.userInformation.email === "";
		return submitterFirstBlank && submitterLastNameBlank && submitterEmailBlank;
	}
	
	isFormValid(section, form) {
		let { getFieldError, getFieldValue } = form;
		let formValid = true;

		if (this.needUzserInfo() && (getFieldValue('submitterFirstName') === undefined 
				|| getFieldValue('submitterLastName') === undefined 
				|| getFieldValue('submitterEmail') === undefined)) {
			console.log("form invalid because of user info")
			return false;
		}
		
		let fields = section.fields;
		for (let i =0; i< fields.length; i++) {
			let field = fields[i];
			let fieldName = field.fieldName;
			if ( field.type !== 'Submitter Information' ) {
				if ( field.required && !this.isFieldDisabled(field, form)) {
				const fieldValue = getFieldValue(fieldName);
					if(getFieldError(fieldName) !== undefined){
						return false;
					}
					if(fieldValue === undefined || fieldValue.length === 0){
						return false;
					}
				}
			}
		}
			
		return formValid;
	}
	
	isSubmitDisabled() {
		let validForm = this.isFormValid(this.props.formDTD.standardFields, this.props.form);
		let { getFieldValue } = this.props.form;

		if (getFieldValue('packageType') !== undefined) {
			let dynamicFormElements = this.props.formDTD.typeSpecificElements.filter(
				function(element) {
					return element.hasOwnProperty(getFieldValue('packageType'))
				});

			if (dynamicFormElements.length > 0) {
				dynamicFormElements = dynamicFormElements[0][getFieldValue('packageType')];
				let sections = dynamicFormElements.sections;
				for (let i =0; i< sections.length; i++) {
					if (!this.isFormValid(sections[i], this.props.form)) {
						validForm = false;
						break;
					}
				}
			}
		}

		return !(!this.state.submitClicked && validForm && (this.state.filesAdded > 0));
	}
	
	render() {

		if(!this.isRemoteDataLoaded()) {
			return (
				<h4 className="text-center pt-3">
					Loading upload form...
				</h4>
			);
		}

		let { getFieldValue } = this.props.form;
		let dynamicFormElements = [];
		let dynamicSections = null;
		if (getFieldValue('packageType') !== undefined) {
			dynamicFormElements = this.props.formDTD.typeSpecificElements.filter(function(element) { return element.hasOwnProperty(getFieldValue('packageType')) });
			if (dynamicFormElements.length > 0) {
				dynamicFormElements = dynamicFormElements[0][getFieldValue('packageType')];
				dynamicSections = dynamicFormElements.sections.map((section) => {
					return this.renderSection(section, this.props.form, this.props.userInformation);
				})
			}
		}
		let dropzoneHidden = this.state.largeFilesChecked?" hidden":"";
		return (
			<React.Fragment>
				<Prompt
					when={true}
					message={'Your data will be lost.  Press OK to continue or Cancel to stay.'}
				/>
				<article id="largeFileSupport" className="upload-form-section container justify-content-center pt-4">
					<section>
					</section>
				</article>
				<article id="dynamicUploadForm" className="upload-form-section container justify-content-center pt-4">
					<h4>STEP 1: Provide the upload information</h4>
					{this.renderSection(this.props.formDTD.standardFields, this.props.form, this.props.userInformation)}
					{dynamicSections}
          <h4>STEP 2: Add your files</h4>
            <Row className={"dropzone btn-sm"}>
							<Col md={12}>
								<FileDropzone uploader={uploader} isUploading={this.props.isUploading}/>
							</Col>
						</Row>
					<h4>STEP 3: Click upload</h4>
					<Row className="fixed-bottom pt-4" id="form-footer">
						<div className="container justify-content-center">
							<Row className="text-center">
								<Col md={12}>
									<Link to="/">
										<Button id="cancel" className="mr-3">Cancel</Button>
									</Link>
									<Button id="submit" disabled={this.isSubmitDisabled()} type="primary" onClick={this.handleSubmit}>Upload</Button>
								</Col>
							</Row>
						</div>
					</Row>
					
				</article>
			</React.Fragment>
		);
	}
}

DynamicForm.propTypes = {
	loadRemoteData: PropTypes.func.isRequired,
	formDTD: PropTypes.object,
	isUploading: PropTypes.bool.isRequired,
	form: PropTypes.object.isRequired,
	userInformation: PropTypes.any,
}


const WrappedUniversalHeaderForm = Form.create({ name: 'universalHeader', validateMessage: "Required" })(DynamicForm);

export default WrappedUniversalHeaderForm;
