import { combineReducers } from 'redux';
import actionNames from './actions/actionNames';
import loadedState from './initialState';
import { filtering, dtds, showLargeFileModal, refreshPackages } from './components/Packages/packagePanelReducer';
import { packageTypeIcons } from './components/Packages/packageTypeIconsReducer';
import { isUploading, formDTD } from './components/Upload/uploadFormReducer';
import { userInformation } from './components/userInformationReducer';
import { stateDisplayMap } from './components/Packages/stateDisplayMapReducer';
import { sessionStart } from './components/SessionTimeout/sessionTimeoutReducer';
import { duplicatePackage } from './actions/Packages/packageActions';

const appReducer = combineReducers({
    filtering,
    dtds,
    isUploading,
    formDTD,
    userInformation,
    packageTypeIcons,
    stateDisplayMap,
    showLargeFileModal,
    sessionStart,
    refreshPackages,
    duplicatePackage
});

const rootReducer = (state, action) => {
    if(action.type === actionNames.RESET_STATE) {
        state = loadedState;
    }
    return appReducer(state, action);
}

export default rootReducer;
