import { combineReducers } from 'redux';
import actionNames from './actions/actionNames';
import loadedState from './initialState';
import { packages as filtering, dtds } from './components/Packages/packagePanelReducer';
import { packageTypeIcons } from './components/Packages/packageTypeIconsReducer';
import { isUploading, formDTD } from './components/Upload/uploadFormReducer';
import { userInformation } from './components/userInformationReducer';
import { help } from './components/Help/helpPaneReducer';

const appReducer = combineReducers({
    filtering,
    dtds,
    isUploading,
    formDTD,
    userInformation,
    help,
    packageTypeIcons
});

const rootReducer = (state, action) => {
    if(action.type === actionNames.RESET_STATE) {
        state = loadedState;
    }
    return appReducer(state, action);
}

export default rootReducer;