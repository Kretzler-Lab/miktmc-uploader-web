import React, { Component } from 'react';
import FilterControl from './FilterControl';
import PackageListContainer from '../Packages/PackageListContainer';
import { Button, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import * as filterActions from '../../actions/filterActions';
import PropTypes from 'prop-types';

class PackagesPane extends Component {

	componentDidMount() {
		if(!this.isRemoteDataLoaded()) {
			this.props.loadRemoteData();
		}
	}

	isRemoteDataLoaded() {
		return Object.keys(this.props.users).length !== 0
			&& this.props.users.constructor === Object
			&& this.props.packageTypes.length > 0;
	}

	sortFunc(option1, option2)
	{
		let returnVal = 0;
		let label1 = option1.label ? option1.label.toUpperCase() : "";
		let label2 = option2.label ? option2.label .toUpperCase() : "";

		if (label1 < label2) {
			returnVal = -1;
		}

		if (label1 > label2) {
			returnVal = 1;
		}

		return returnVal;
	}

	packageTypesToOptions(packageTypes) {
		let packageTypeOptions = packageTypes.map(value => {
			return { value: value, label: value }
		});

		packageTypeOptions.sort(this.sortFunc);

		return packageTypeOptions;
	}

	usersToOptions = (users) => {
		let userOptions = [];
		users.sort((user1, user2) => {
			let returnVal = 0;
			let user1Upper = user1.firstName.toUpperCase();
			let user2Upper = user2.firstName.toUpperCase();
			if (user1Upper < user2Upper) {
				returnVal = -1;
			}
			if (user1Upper > user2Upper) {
				returnVal = 1;
			}
			return returnVal;
		});
		users.map((user, index) => {
			let label = user.firstName + " " + user.lastName;
			return userOptions.push( {value: user.id, label: label});
		});
		return userOptions;
	}
	
	siteNamesToOptions = (siteNames) => {
		let siteNameOptions = siteNames.map(value => {
			return { value: value, label: value }
		});

		siteNameOptions.sort(this.sortFunc);

		return siteNameOptions;
	}

    studyNamesToOptions = (studyNames) => {
        let studyNameOptions = studyNames.map(value => {
            return {value: value, label: value}
        });
        studyNameOptions.sort(this.sortFunc);
        return studyNameOptions;
    }

	biopsyIdsToOptions = (biopsyIds) => {
		let biopsyIdOptions = biopsyIds.map(value => {
			return {value: value, label: value}
		});
		biopsyIdOptions.sort(this.sortFunc);
		return biopsyIdOptions;
	}
	
    render() {
    	let userOptions = this.usersToOptions(this.props.users);
		let packageTypeOptions = [];
		if (this.props.packageTypes.length) {
			packageTypeOptions = this.packageTypesToOptions(this.props.packageTypes);
		}
		let siteNameOptions = [];
		if (this.props.siteNames.length) {
			siteNameOptions = this.siteNamesToOptions(this.props.siteNames);
		}
        let studyNameOptions = []
        if (this.props.studyNames.length) {
            studyNameOptions = this.studyNamesToOptions(this.props.studyNames);
        }
		let biopsyIdOptions = []
		if (this.props.biopsyIds.length) {
			biopsyIdOptions = this.biopsyIdsToOptions(this.props.biopsyIds);
		}
        return (
    		<article id="packages-pane" className="container pb-2">
    			<header id="packages-filter-controls" className="fixed-top-subnav pt-3">
					<div className='container'>
						<Row noGutters>
              						<Col xs={12} md={"auto"} className="mx-sm-auto ml-md-0 mr-md-1">
							<FilterControl className="filter-control" placeholder="Filter by biopsy ID" options={biopsyIdOptions} type={filterActions.filterTypes.BIOPSY_ID} addFilter={this.props.addFilter} removeFilter={this.props.removeFilter}/>
						</Col>
							<Col xs={12} md={"auto"} className="mx-sm-auto ml-md-0 mr-md-1">
								<FilterControl className="filter-control" placeholder="Filter by study" options={studyNameOptions} type={filterActions.filterTypes.STUDY} addFilter={this.props.addFilter} removeFilter={this.props.removeFilter}/>
							</Col>
							<Col xs={12} md={"auto"} className="mx-sm-auto ml-md-0 mr-md-1">
								<FilterControl className="filter-control" placeholder="Filter by upload type" options={packageTypeOptions} type={filterActions.filterTypes.PACKAGE_TYPE} addFilter={this.props.addFilter} removeFilter={this.props.removeFilter}/>
							</Col>
							<Col xs={12} md={"auto"} className="mx-sm-auto ml-md-0 mr-md-1">
								<FilterControl className="filter-control" placeholder="Filter by submitter" options={userOptions} type={filterActions.filterTypes.SUBMITTER} addFilter={this.props.addFilter} removeFilter={this.props.removeFilter}/>
							</Col>
							<Col className="ml-auto mr-auto mr-lg-0 text-right">
								<Link to="/upload"
									className="d-block-inline ml-1">
									<Button id="packages-button-add-new"
											color="primary"
											className="btn-sm packages-pane-filter-button">Add new upload</Button>
								</Link>
							</Col>
						</Row>
						<Row>
							<Col xs={12}>
								<i className="text-secondary">Search results are displayed in reverse chronological order</i>
							</Col>
						</Row>
					</div>
				</header>

				<Row>
					<PackageListContainer />
				</Row>
			</article>
		);
	}
}

PackagesPane.propTypes = {
	loadRemoteData: PropTypes.func.isRequired,
	users: PropTypes.array,
	packageTypes: PropTypes.array,
	siteNames: PropTypes.array,
	biopsyIds: PropTypes.array
}

export default PackagesPane;
