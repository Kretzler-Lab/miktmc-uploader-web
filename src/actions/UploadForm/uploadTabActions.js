import actionNames from '../actionNames';
import Api from '../../helpers/Api';

const api = Api.getInstance();

export const showUploadModalAction = (show) => {
	return {
		type: actionNames.SHOW_UPLOAD_MODAL,
		payload: show
	}
}

export const changeUploadTab = (tabIndex) => {
	return {
		type: actionNames.CHANGE_UPLOAD_TAB,
		payload: tabIndex
	}
}

export const updateFilesToUpload = (files) => {
    return {
        type: actionNames.UPDATE_FILES_TO_UPLOAD,
        payload: files
    }
};

export const updateFileDescription = (description) => {
    return {
        type: actionNames.UPDATE_FILE_DESCRIPTION,
        payload: description
    }
};

export const setPackageInfo = (data) => {
    return {
        type: actionNames.SET_PACKAGE_INFO,
        payload: data
    }
};

export const appendToFileList = (file) => {
    return {
        type: actionNames.APPEND_TO_FILE_LIST,
        payload: file
    }
};

export const clearFileList = () => {
	return {
		type: actionNames.CLEAR_FILE_LIST
	}
};

export const setUploadedFilesList = (uploadedFiles) => {
	return {
		type: actionNames.SET_UPLOADED_FILES_LIST,
		payload: uploadedFiles
	}
};

export const uploadPackageInfo = (data) => {
    return (dispatch) => {
        api.post('/upload/packageInfo', data)
          .then((res) => {
            dispatch(setPackageInfo(res.data));
          })
          .catch((err) => {
            alert("We were unable to process your request, please try again");
            console.log(err);
          })
    };
}

export const viewUploadedFiles = () => {
	return (dispatch) => {
		api.get('/viewUploads')
			.then(res => {
				dispatch(setUploadedFilesList(res.data));
			})
			.catch(err => console.error(err));
	};
}
