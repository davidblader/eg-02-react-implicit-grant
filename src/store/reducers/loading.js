import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    loadingMsg: null,
    alertMsg: null
};

const loadingStart = ( state, action ) => {
    return updateObject( state, { 
        loadingMsg: action.loadingMsg
    });
};

const loadingStop = ( state, action ) => {
    return updateObject( state, { 
        loadingMsg: null
    });
};

const showAlert = ( state, action ) => {
    return updateObject( state, { 
        alertMsg: action.alertMsg
    });
};

const alertReset = ( state, action ) => {
    return updateObject( state, { 
        alertMsg: null
    });
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.LOADING_START: return loadingStart( state, action );
        case actionTypes.LOADING_STOP: return loadingStop( state, action );
        case actionTypes.ALERT: return showAlert( state, action );
        case actionTypes.ALERT_RESET: return alertReset( state, action );
        default: return state;
    }
};

export default reducer;