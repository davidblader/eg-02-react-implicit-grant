import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    envelopes: [], // Because this is an array, see special code in updateObject
    listEnvError: null
};

const listEnvelopesStart = ( state, action ) => {
    return updateObject( state, 
        {listEnvError: null,
         envelopes: null
        } );
};

const listEnvelopesDataRecvd = ( state, action ) => {
    let newEnvelopes = 
        state.envelopes.map(a => ({...a}));
    newEnvelopes.push (action.data);

    return updateObject( state, 
        { envelopes: newEnvelopes } );
};

const resetEnvList = ( state, action ) => {
    return updateObject( state, 
        { envelopes: [] } );    
}

const listEnvelopesError = ( state, action ) => {
    return updateObject( state, 
        { listEnvError: action.listEnvError } );
};


const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.LIST_ENVELOPES_START: return listEnvelopesStart( state, action );
        case actionTypes.LIST_ENVELOPES_DATA_RECVD: return listEnvelopesDataRecvd( state, action );
        case actionTypes.LIST_ENVELOPES_ERROR: return listEnvelopesError( state, action );
        case actionTypes.LIST_ENVELOPES_RESET_ENV_LIST: return resetEnvList( state, action );
        default: return state;
    }
};

export default reducer;
