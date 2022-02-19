import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import ljubljanaTransportReducer from './reducers';

const rootReducer = combineReducers({ljubljanaTransportReducer});

export const Store = createStore(rootReducer, applyMiddleware(thunk));