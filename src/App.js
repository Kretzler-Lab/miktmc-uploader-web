import React, { Component } from 'react';
import MainPage from './components/v2/MainPage';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import loadedState from './initialState';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { getUserInformation } from './actions/v2/userActions';

window.sessionStorage.clear();
const cacheStore = window.sessionStorage.getItem("redux-store");
const initialState = cacheStore ?
    JSON.parse(cacheStore) :
    loadedState;
const store = applyMiddleware(thunk)(createStore)(rootReducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
const saveState = () => {
  window.sessionStorage.setItem("redux-store", JSON.stringify(store.getState()));
};

store.subscribe(function(){console.log(store.getState())});
store.subscribe(saveState);

class App extends Component {
  
	componentWillMount() {
		getUserInformation()(store.dispatch);
	}
	
	render() {
	    return (
	    		<Provider store={store}>
	    			<BrowserRouter>
	    				<Switch>
	    					<Route exact path="/" component={MainPage} store={store}/>
	    				</Switch>
	    			</BrowserRouter>
	    		</Provider>
	    );
	  }
}

export default App;
