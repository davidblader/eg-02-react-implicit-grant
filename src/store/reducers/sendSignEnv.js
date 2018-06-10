import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    envelopeId: null,
    sendSignError: null
};

const sendSignEnvStart = ( state, action ) => {
    return updateObject( state, 
        {sendSignError: null,
         envelopeId: null
        } );
};

const sendSignEnvIdRecvd = ( state, action ) => {
    return updateObject( state, 
        {envelopeId: action.envelopeId
        } );
};

const sendSignEnvError = ( state, action ) => {
    return updateObject( state, 
        { sendSignError: action.sendSignError } );
};


const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.SEND_SIGN_ENV_START: return sendSignEnvStart( state, action );
        case actionTypes.SEND_SIGN_ENV_ID_RECVD: return sendSignEnvIdRecvd( state, action );
        case actionTypes.SEND_SIGN_ENV_ERROR: return sendSignEnvError( state, action );
        default: return state;
    }
};

export default reducer;
