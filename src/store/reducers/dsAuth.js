import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    token: null,
    userId: null,
    expirationDate: null,
    error: null,
    badDsConfig: null,
    authRedirect: null, // redirect the user after authenticated
    newAuthentication: null, // newly authenticated. Triggers authRedirect
    routerReplace: null, // do a router replace operation
    accounts: [], // from OAuth::userInfo
    name: null,
    email: null,
    accountId: null, // current account info
    accountName: null, // current account info
    baseUrl: null, // baseUrl for the account
    baseUrlCors: null, // the CORS gateway that is used instead of the baseUrl
    startingUp: true // reset by 
};

const finishedStartup = ( state, action ) => {
    return updateObject ( state, { startingUp: false })
}

const authStart = ( state, action ) => {
    return updateObject( state, { error: null } );
};

const authSetBadConfig = ( state, action ) => {
    return updateObject( state, { badDsConfig: action.badDsConfig } );
};

const authRecdToken = (state, action) => {
    return updateObject( state, { 
        token: action.token,
        expirationDate: action.expirationDate,
        error: null,
     } );
};

const authFail = (state, action) => {
    return updateObject( state, {
        error: action.error,
    });
};

const dsLogout = (state, action) => {
    return updateObject(state, {
       token: null,
       expirationDate: null,
       userId: null,
       accounts: [],
       authRedirect: null,
       name: null,
       email: null,
       accountId: null,
       accountName: null,
       baseUrl: null,
       baseUrlCors: null
    })
}

const setAuthRedirect = (state, action) => {
    return updateObject(state, { authRedirect: action.authRedirect })   
}

const setRouterReplace = (state, action) => {
    return updateObject(state, { routerReplace: action.routerReplace })   
}

const receivedUserInfo = (state, action) => {
    return updateObject(state, {
        name: action.name,
        email: action.email,
        userId: action.userId,
        accounts: action.accounts,
        accountId: action.accountId,
        accountName: action.accountName,
        baseUrl: action.baseUrl,
        baseUrlCors: action.baseUrlCors    
    })
}

const restoreFromStorage = (state, action) => {
    return updateObject(state, {
        authRedirect: action.authRedirect
        , name: action.name
        , email: action.email
        , userId: action.userId
        , accountId: action.accountId
        , accountName: action.accountName
        , baseUrl: action.baseUrl
        , baseUrlCors: action.baseUrlCors
        , token: action.token
        , expirationDate: action.expirationDate
        , accounts: action.accounts
    })    
}

const newAuthentication = (state, action) => {
    return updateObject(state, {
        newAuthentication: true
    })
}

const newAuthenticationRedirected = (state, action) => {
    return updateObject(state, {
        newAuthentication: null,
        authRedirect: null
    })
}

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.DS_AUTH_START: return authStart(state, action);
        case actionTypes.DS_AUTH_RECD_TOKEN: return authRecdToken(state, action);
        case actionTypes.DS_AUTH_FAIL: return authFail(state, action);
        case actionTypes.DS_AUTH_LOGOUT: return dsLogout(state, action);
        case actionTypes.DS_AUTH_CHECK_CONFIG: return authSetBadConfig(state, action);
        case actionTypes.DS_AUTH_RECD_USER_INFO: return receivedUserInfo(state, action);
        case actionTypes.DS_AUTH_SET_AUTH_REDIRECT: return setAuthRedirect(state, action);
        case actionTypes.DS_AUTH_SET_ROUTER_REPLACE: return setRouterReplace(state, action);
        case actionTypes.DS_AUTH_RESTORE_FROM_STORAGE: return restoreFromStorage(state, action);
        case actionTypes.DS_AUTH_NEW_AUTHENTICATION: return newAuthentication(state, action);        
        case actionTypes.DS_AUTH_NEW_AUTHENTICATION_REDIRECTED: return newAuthenticationRedirected(state, action);
        case actionTypes.DS_AUTH_FINISHED_STARTUP: return finishedStartup (state, action);
        default:
            return state;
    }
};

export default reducer;