import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';

class UploadedFilesTable extends Component {

	constructor(props) { 
		super();
		
		this._columns = [
		      { key: 'researcher', name: 'Name' },
		      { key: 'institution', name: 'Site' },
		      { key: 'packageType', name: 'Type' },
		      { key: 'filename', name: 'File Name'},
		      { key: 'subjectId', name:'Subject Id'},
		      { key: 'experimentId', name:'Experiment Id'},
		      { key: 'experimentDate', name: 'Experiment Date'}];
		this.state = { rows: props.uploadedFiles };
	}
	  
	componentWillReceiveProps(nextProps) {
		this.setState({ rows: nextProps.uploadedFiles });
	}
	
	componentDidMount() {
		this.setState({ rows: this.props.uploadedFiles });
	}
	
	rowGetter = (i) => {
		return this.state.rows[i];
	};

	render() {
		return(
			<div className="row">
				<div className="col-sm-12">
					<div className="uploadTable">
						{ this.state.rows.length ? <ReactDataGrid
							columns={this._columns}
							rowGetter={this.rowGetter}
							rowsCount={this.state.rows.length}
							minHeight={500} /> : '' }
					</div>		
				</div>
			</div>
		);
	}
}

export default UploadedFilesTable;