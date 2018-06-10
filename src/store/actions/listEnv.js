import axios from 'axios';
import * as actionTypes from './actionTypes';
import dsConfig from '../../dsConfig';
import { loadingStart, loadingStop, showAlert } from './loading';
import moment from 'moment';

/**
 * To keep the Action slimmer (and not look in other
 * areas of the Store), we pass in basic parameters:
 * @param {string} baseUrlCors 
 * @param {string} token 
 * @param {string} accountId 
 */
export const listEnvelopesStart = (baseUrlCors, token, accountId) => {
    return dispatch => {
        dispatch( resetEnvList());
        dispatch( loadingStart( 'Fetching envelope list' ));
        // Call  (via the cors gateway!)
        // First we get a list of the envelope IDs, then we get the status for each.
        // Total of n+1 API calls where n is the number of envelopes sent in the
        // last month
        // 
        // NOTE: For this example, we will process a maximum of 10 envelopes
        const config = {headers: {'Authorization': `Bearer ${token}`}}
            , queryParams = `?from_date=${encodeURIComponent(moment().subtract(30, 'days').format())}`
            , url = `${baseUrlCors}${dsConfig.apiUrlFrag}/accounts/${accountId}/envelopes${queryParams}`
            ;
        axios.get(url, config)
        .then(response => {
            // Now we have the Envelopes::listStatusChanges response
            // See https://developers.docusign.com/esign-rest-api/reference/Envelopes/Envelopes/listStatusChanges
            const envelopes = response.data.envelopes;
            if (envelopes.length > 10) {
                response.data.envelopes = envelopes.slice(Math.max(envelopes.length - 10, 0))
            }
            dispatch( showAlert( `${response.data.envelopes.length} envelopes. Fetching the details for each envelope.`));
                    
            // Create a promise chain for each envelope in the results list.
            function getEnvelope(envelopeId){
                const config = {headers: {'Authorization': `Bearer ${token}`}}
                    , url = `${baseUrlCors}${dsConfig.apiUrlFrag}/accounts/${accountId}/envelopes/${envelopeId}`
                    ;
                return (
                    // Calling Envelopes::get
                    // See https://developers.docusign.com/esign-rest-api/reference/Envelopes/Envelopes/get
                    axios.get(url, config)
                    .then(response => {
                        dispatch( listEnvelopesDataRecvd(response.data));
                    })
                )}

            // Return the promise chain from last element
            return (
                response.data.envelopes.reduce(function (chain, item) {
                    // bind item to the first argument of each function instantiation
                    return chain.then(getEnvelope.bind(null, item.envelopeId));
                    // start chain with promise of first item
                    }, Promise.resolve())
                .then (() => {
                    // This is after the completed chain
                    dispatch( loadingStop());
                })
            )
        })
        .catch(err => {
            let message = err.message;
            if (err.response && err.response.data && err.response.data.error) {
                message += '; ' + err.response.data.error;
            }
            dispatch( loadingStop());
            dispatch( showAlert (`Problem! ${message}`));                                
            dispatch( listEnvelopesError(message));
        })
    }
}

const resetEnvList = () => {
    return {
        type: actionTypes.LIST_ENVELOPES_RESET_ENV_LIST,
    };    
}
const listEnvelopesDataRecvd = (data) => {
    return {
        type: actionTypes.LIST_ENVELOPES_DATA_RECVD,
        data: data
    };
}

const listEnvelopesError = (listEnvError) => {
    return {
        type: actionTypes.LIST_ENVELOPES_ERROR,
        listEnvError: listEnvError
    };
}
