import * as actionTypes from './actionTypes';


export const loadingStart = ( loadingMsg ) => {
    return {
        type: actionTypes.LOADING_START,
        loadingMsg: loadingMsg
    };
}

export const loadingStop = () => {
    return {
        type: actionTypes.LOADING_STOP
    };
};

export const showAlert = ( alertMsg ) => {
    return {
        type: actionTypes.ALERT,
        alertMsg: alertMsg
    };
};

export const alertReset = () => {
    return {
        type: actionTypes.ALERT_RESET
    };
};

