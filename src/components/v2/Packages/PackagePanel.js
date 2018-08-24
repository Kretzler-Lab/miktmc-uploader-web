import React, { Component } from 'react';
import { Panel, Col, Row, Button } from 'react-bootstrap';
import { getLocalDateString, getLocalTimeString } from '../../../helpers/timezoneUtil';

class PackagePanel extends Component {

    handleAttachmentClick(e) {

    }

    render() {
        var submittedDate = getLocalDateString(this.props.uploadPackage.createdAt);
        var submittedTime = getLocalTimeString(this.props.uploadPackage.createdAt);
    		return (
            <Panel className="pkg-panel">
                <Panel.Body>
                    <Row>
                        <Col md={6} className="pkg-panel-info">
                            <div><b>{this.props.uploadPackage.packageId}</b></div>
                            <div><a>{this.props.uploadPackage.packageType}</a></div>
                            <div>Submitted <b>{submittedDate}</b> at {submittedTime} by <a>{this.props.uploadPackage.submitter}, {this.props.uploadPackage.institution}</a></div>
                        </Col>
                        <Col md={2} mdOffset={4} className="pkg-panel-right">
                            <div><a onClick={this.handleAttachmentClick}>{this.props.uploadPackage.attachments.length} attachment(s)</a></div>
                            <div><a>Show package metadata</a></div>
                            <div>
                                <Button className="btn btn-primary">
                                    <span className="glyphicon glyphicon-download-alt" />
                                    <i> </i>
                                    <b>Download</b>
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Panel.Body>
            </Panel>
        );
    }
}

export default PackagePanel;