import React, { Component } from 'react';
import { Col } from 'reactstrap';

class NavFooter extends Component {
    render() {
        return (
            <div id="footer" className="fixed-bottom px-1 py-1">
                <Col sm="6">
                    <a className="text-light small"
                    href="https://miktmc.org" target="_blank"  rel="noopener noreferrer">
                        &copy; Michigan Kidney Translational Medicine Center (MiKTMC)</a>
                </Col>
                <Col sm="6">
                    <a className="text-light small" href="/privacy">Privacy Statement</a>
                </Col>
            </div>
        );
    }
}

export default NavFooter;