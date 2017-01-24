import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import user from './user';

const rootReducer = combineReducers({
    form,
    routing,
    user,
});

export default rootReducer;
