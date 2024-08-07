import React, { Component } from 'react';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types';

const requiredFieldNumericOptions = {validateTrigger: [ 'onChange', 'onBlur' ], rules: [{required: true, message: 'Required'}]};
const optionalFieldNumericOptions = {validateTrigger: [ 'onChange', 'onBlur' ], rules: [{required: false}]};

class NumericField extends Component {

	isFieldDisabled = () => {
		if (this.props.isFieldDisabled !== undefined) {
			return this.props.isFieldDisabled(this.props.json, this.props.form);
		} else {
			return this.props.isDisabled;
		}
	}
	
	handleConstrainsChange = () => {
        if (this.props.constrains !== undefined) {
			let { resetFields } = this.props.form;
			this.props.constrains.forEach(constrainedField => {
				resetFields([constrainedField]);
			});
		}
	}

	clearContents = () => {
		let { resetFields } = this.props.form;
		resetFields(this.props.fieldName);
	}
	
    render() {
        let { isFieldTouched, getFieldError, getFieldDecorator } = this.props.form;
        let error = isFieldTouched(this.props.fieldName) && getFieldError(this.props.fieldName);
        let fieldOptions = this.props.isRequired ? requiredFieldNumericOptions : optionalFieldNumericOptions;
        let isDisabled = this.isFieldDisabled();
        if (isDisabled) {
        	this.clearContents();
        }
        let placeholderText = undefined;
		if (this.props.additionalProps !== undefined) {
			placeholderText = this.props.additionalProps.placeholderText;
		}
        
        return (
            <Form.Item label={this.props.label} validateStatus={error ? 'error' : ''}>
                {getFieldDecorator(this.props.fieldName, fieldOptions)(
                    <Input type="number" name={this.props.fieldName} placeholder={placeholderText} disabled={isDisabled} onChange={this.handleConstrainsChange}/>
                )}
            </Form.Item>
        );

    }
}

NumericField.propTypes = {
    fieldName: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isRequired: PropTypes.bool.isRequired,
    isDisabled: PropTypes.bool,
    form: PropTypes.object.isRequired,
    additionalProps: PropTypes.object
};

export default NumericField;