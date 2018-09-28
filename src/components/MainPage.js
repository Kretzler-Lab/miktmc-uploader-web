import React, { Component } from 'react';
import {panes} from './Nav/NavBar';
import NavBarContainer from './Nav/NavBarContainer';
import PaneHolder from './PaneHolder'

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pane: panes.packages
        };
    }

    handlePaneSelect = (pane) => {
        this.setState({
            pane
        });
    }

    render() {
        return (
            <div>
                <NavBarContainer pane={this.state.pane} handlePaneSelect={this.handlePaneSelect} />
                <PaneHolder pane={this.state.pane} />
            </div>
        );
    }
}

export default MainPage;