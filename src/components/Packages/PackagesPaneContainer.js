import { connect } from 'react-redux';
import PackagesPane from './PackagesPane';
import { addFilter, getUsers, removeFilter } from '../../actions/filterActions';
import { getUserInformation } from "../../actions/userActions";
import { getFormDTD } from "../../actions/Upload/uploadActions";
import { getPackageTypeIcons } from '../../actions/packageTypeIconsActions';
import { getStateDisplayMap } from '../../actions/stateActions';
import { setDtds, setRefreshPackages } from '../../actions/Packages/packageActions';
import { getStateEvents } from '../../actions/stateActions';

const mapStateToProps = (state, props) =>
({
	users: state.filtering.userList,
	packageTypes: state.filtering.packageTypes,
	siteNames: state.filtering.siteNames,
    studyNames: state.filtering.studyNames,
    biopsyIds: state.filtering.biopsyIds,
    refreshPackages: state.refreshPackages,
	filtering: state.filtering,
	formDTD: state.formDTD,
	packageTypeIcons: state.packageTypeIcons
});
    
const mapDispatchToProps = (dispatch, props) =>
({
	addFilter(type, value) {
		dispatch(addFilter(type, value));
	},

	removeFilter(type, value) {
		dispatch(removeFilter(type, value));
	},

	loadRemoteData() {
		dispatch(getUserInformation());
		dispatch(getUsers());
		dispatch(getFormDTD());
		dispatch(getPackageTypeIcons());
		dispatch(getStateDisplayMap());
	},

    setDtds(packages) {
		dispatch(setDtds(packages));
	},

	poll(callback) {
		dispatch(getStateEvents(callback));
	},

	setRefreshPackages(refreshPackages) {
		dispatch(setRefreshPackages(refreshPackages));
	}
});
    
export default connect(mapStateToProps, mapDispatchToProps)(PackagesPane);