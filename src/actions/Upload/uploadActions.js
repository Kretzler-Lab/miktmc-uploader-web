import Api from '../../helpers/Api';
import actionNames from '../actionNames';
import { sendMessageToBackend } from '../Error/errorActions';
import { setPackageTypesFromDTD, setSiteNamesFromDTD, setStudyNamesFromDTD, setBiopsyIdsFromDTD } from '../filterActions.js';

const api = Api.getInstance();

export const setFormDTD = (formDTD) => {
	return {
		type: actionNames.SET_FORM_DTD,
		payload: formDTD
	}
}

export const getFormDTD = () => {
	return (dispatch) => {
		api.get('/api/v1/form')
			.then(res => {
				dispatch(setFormDTD(res.data));
				dispatch(setPackageTypesFromDTD(res.data));
				dispatch(setSiteNamesFromDTD(res.data));
                dispatch(setStudyNamesFromDTD(res.data));
                dispatch(setBiopsyIdsFromDTD(res.data));
			})
			.catch((err) => {
				dispatch(sendMessageToBackend(err));
			});
	}
}