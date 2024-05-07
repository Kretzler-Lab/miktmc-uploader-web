import Api from '../helpers/Api';	
import actionNames from './actionNames';	
import { sendMessageToBackend } from './Error/errorActions';	

 const api = Api.getInstance();	

 export const getUserInformation = () => {	
	return (dispatch) => {
		api.get('/api/v1/userInformation')
			.then(res => {
				dispatch(setUserInformation(res.data));
				return Promise.resolve();
			})	
			.catch(err => {
				dispatch(sendMessageToBackend(err));
	        });
	};	
} 	

 export const setUserInformation = (userInfo) => {	
	return {	
		type: actionNames.SET_USER_INFORMATION,	
		payload: userInfo	
	}	
} 