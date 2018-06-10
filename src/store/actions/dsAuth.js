import axios from 'axios';
import * as actionTypes from './actionTypes';
import dsConfig from '../../dsConfig';
import { loadingStart, loadingStop, showAlert } from './loading';

export const dsAuthStart = () => {
    return dispatch => {
        dispatch( loadingStart( 'Authenticating with DocuSign' ));        
        const authStartUrl = dsConfig.oauth + 
            "&client_id=" + dsConfig.clientId +
            "&redirect_uri=" + dsConfig.redirectUri;  
        window.location.href = authStartUrl;
    };
};

const checkDsConfig = () => {
    return {
        type: actionTypes.DS_AUTH_CHECK_CONFIG,
        badDsConfig: dsConfig.clientId === "client_id"
    };
}

// Restore settings from local storage
const restoreFromStorage = () => {

    return dispatch => {
        // NOTE: localStorage only stores STRINGS! 
        // So need to rehydrate any items that might not be a string!
        const rehydrate = (str) => {
            if (str === 'null') {return null}
            if (str === 'true') {return true}
            if (str === 'false') {return false}
            if (str === 'undefined') {return undefined}
            return str
        }

        const rehydrateInt = (str) => {
            if (str === '') {return 0}
            return parseInt(str, 10)
        }

        const restoreFromStorage2 = () => {
            return {
                type: actionTypes.DS_AUTH_RESTORE_FROM_STORAGE
                , authRedirect: rehydrate(localStorage.getItem('authRedirect'))
                , name: rehydrate(localStorage.getItem('name'))
                , email: rehydrate(localStorage.getItem('email'))
                , userId: rehydrate(localStorage.getItem('userId'))
                , accountId: rehydrate(localStorage.getItem('accountId'))
                , accountName: rehydrate(localStorage.getItem('accountName'))
                , baseUrl: rehydrate(localStorage.getItem('baseUrl'))
                , baseUrlCors: rehydrate(localStorage.getItem('baseUrlCors'))
                , token: rehydrate(localStorage.getItem('token'))
                , expirationDate: expirationDate
                , accounts: accounts
            }    
        }

        const accountsJSON = localStorage.getItem('accounts')
            , accounts = (accountsJSON && accountsJSON.length > 0 && 
                JSON.parse(accountsJSON)) || []
            , expirationDate = rehydrateInt(localStorage.getItem('expirationDate'))
            , now = Date.now()
            , expiresIn = (expirationDate - now) > 0 ? (expirationDate - now) / 1000 : null;

        dispatch (restoreFromStorage2())
        // Reset autolog out timer
        if (expiresIn) {
            dispatch( checkAuthTimeout( expiresIn ));
        }
    }
}

const checkHashToken = () => {
    // Check our url's hash to see if we've received a token
    // If we were redirected to via an OAuth Implicit Grant flow, then our
    // url should include the token as a hash value.
    // eg http://localhost/implicit_grant/implicit_grant.html/#access_token=eyJ0eXAiOiJNVCIsImFsZ&expires_in=28800&token_type=bearer

    return dispatch => {
        let hash = window.location.hash; // returns a string
        hash = hash.length > 0 ? hash.substr(1) : ''; // remove the # character
        let searchParams = new URLSearchParams(hash); // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams

        if (searchParams.has('access_token')) {
            // Got it!
            let expiresIn = parseInt(searchParams.get('expires_in'), 10)
            , token = searchParams.get('access_token')
                // let token_type = searchParams.get('token_type'); // Not needed
            , expirationDate = Date.now() + expiresIn * 1000; // convert sec to milliseconds
            
            // Remove the OAuth Implicit Grant response hash info. 
            // Later we will redirect as appropriate
            dispatch( setRouterReplace('/'));
            dispatch( showAlert('You are logged in.'));
            dispatch( authTokenReceived(token, expirationDate) );
            dispatch( checkAuthTimeout( expiresIn ));
            
            // Next, call OAuth::userInfo (via the cors gateway!)
            dispatch( loadingStart( 'Fetching your account information' ));
            const userInfoFragment = '/oauth/userinfo'
                , url = dsConfig.oauthCORS + userInfoFragment
                , config = {headers: {'Authorization': `Bearer ${token}`}}
                ;
            axios.get(url, config)
            .then(response => {
                // Now we have the OAuth::UserInfo response
                dispatch( userInfoReceived(response.data));
                dispatch( loadingStop());
                dispatch( showAlert (`Welcome ${response.data.name}`));
                // Redirect to the previous action
                dispatch( newAuthentication() );
            })
            .catch(err => {
                let message = err.message;
                if (err.response && err.response.data && err.response.data.error) {
                    message += '; ' + err.response.data.error;
                }
                dispatch( loadingStop());
                dispatch( showAlert (`Problem! ${message}`));                                
                dispatch(authFail(message));
            });
    

        } else {
            return {type: null}
        }
    }
}

/**
 * Check if the url is of the form ?event=signing_complete or similar
 * That indicates that the signing ceremony completed successfully.
 * 
 * Future: retrieve the stored envelopeId from local storage
 * and do a GET from the server to see what the real status of 
 * the envelope is now. We must not rely on the event=signing_complete
 * since anyone could spoof us by starting up this app with that qp.
 * 
 * NB. On Chrome, the qp is available. It may not be on other stacks or browsers.
 * In those cases, since if we have an "outstanding" signing ceremony, we can
 * just proactively check the envelope's recipient status to see if it
 * indeed has been signed.
 */
const checkEventQP = () => {
     return dispatch => {
        const loc = window.location.href // returns a string
            , search = "?event=signing_complete"
            , found = loc.indexOf(search) !== -1
            ;
        if (found) {
            // Remove the query parameter. 
            dispatch( setRouterReplace('/'));
            dispatch( showAlert('You signed the envelope!'));
        }
    }
}

const authFail = (error) => {
    return {
        type: actionTypes.DS_AUTH_FAIL,
        error: error
    };
};

export const setAuthRedirect = (authRedirect) => {
    localStorage.setItem('authRedirect', authRedirect);
    return {
        type: actionTypes.DS_AUTH_SET_AUTH_REDIRECT,
        authRedirect: authRedirect
    };
} 

export const setRouterReplace = (routerReplace) => {
    return {
        type: actionTypes.DS_AUTH_SET_ROUTER_REPLACE,
        routerReplace: routerReplace
    };
} 

const userInfoReceived = (userInfo) => {
    // Initially use the default account
    const email = userInfo.email
        , userId = userInfo.sub
        , accounts = userInfo.accounts
        , defaultAccountObj = accounts.find(el => el.is_default)
        , accountId = defaultAccountObj.account_id
        , accountName = defaultAccountObj.account_name
        , baseUrl = defaultAccountObj.base_uri
        ;
    let name = userInfo.name
      , baseUrlCors
      ;

    // At this point we need to find the CORS gateway URL that matches
    // the baseUrl. For production, you will either need multiple
    // gateways, one for na2.docusign.net, eu.docusign.net, etc or
    // one more sophisticated CORS gatewat which can send to different
    // DocuSign production platforms on the fly.
    //
    // For demo, there is only one baseUrl, 'https://demo.docusign.net',
    // so everything is simpler.
    if (baseUrl !== 'https://demo.docusign.net') {
        const msg = `Problem: no CORS gateway for base_URL ${baseUrl}!`;
        console.log (msg);
        name = msg;
    } else {
        baseUrlCors = dsConfig.dsApiCORS;
    }

    localStorage.setItem('name', name);
    localStorage.setItem('email', email);
    localStorage.setItem('userId', userId);
    localStorage.setItem('accountId', accountId);
    localStorage.setItem('accountName', accountName);
    localStorage.setItem('baseUrl', baseUrl);
    localStorage.setItem('baseUrlCors', baseUrlCors);
    localStorage.setItem('accounts', JSON.stringify(accounts));

    return {
        type: actionTypes.DS_AUTH_RECD_USER_INFO,
        name: name,
        email: email,
        userId: userId,
        accounts: accounts,
        accountId: accountId,
        accountName: accountName,
        baseUrl: baseUrl,
        baseUrlCors: baseUrlCors    

    };
}

const authTokenReceived = (token, expirationDate) => {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate);

    return {
        type: actionTypes.DS_AUTH_RECD_TOKEN,
        token: token,
        expirationDate: expirationDate
    };
} 

export const dsLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    localStorage.removeItem('accounts');
    localStorage.removeItem('authRedirect');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('accountId');
    localStorage.removeItem('accountName');
    localStorage.removeItem('baseUrl');
    localStorage.removeItem('baseUrlCors');
    return {
        type: actionTypes.DS_AUTH_LOGOUT
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(dsLogout());
        }, expirationTime * 1000);
    };
};

export const dsAuthStartup = () => {
    return dispatch => {
        dispatch(checkDsConfig());
        dispatch(restoreFromStorage());
        dispatch(checkHashToken());
        dispatch(checkEventQP());
        dispatch(finishedStartup());
    };
}

const newAuthentication = () => {
    return {
        type: actionTypes.DS_AUTH_NEW_AUTHENTICATION
    }
}

export const newAuthenticationRedirected = () => {
    return {
        type: actionTypes.DS_AUTH_NEW_AUTHENTICATION_REDIRECTED
    }
}

 const finishedStartup = () => {
    return {
        type: actionTypes.DS_AUTH_FINISHED_STARTUP
    }
}
