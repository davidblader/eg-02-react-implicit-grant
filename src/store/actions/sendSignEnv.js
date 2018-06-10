import axios from 'axios';
import * as actionTypes from './actionTypes';
import dsConfig from '../../dsConfig';
import { loadingStart, loadingStop, showAlert } from './loading';

/**
 * To keep the Action slimmer (and not look in other
 * areas of the Store), we pass in basic parameters:
 * @param {string} baseUrlCors 
 * @param {string} token 
 * @param {string} accountId 
 * @param {string} envData Info used for creating the envelope 
 */
export const sendSignEnvelopeStart = (baseUrlCors, token, accountId, envData) => {
    return dispatch => {
        const config = {headers: {'Authorization': `Bearer ${token}`}};

        dispatch ( loadingStart( 'Preparing envelope' ));
        dispatch ( sendSignEnvStart ());
        // createEnv returns a promise since it makes a Get call to
        // fetch the pdf file
        createEnv(envData)
        .then (envelopeObject => {
            dispatch( loadingStart( 'Creating envelope' ));
            // Call  (via the cors gateway!)
            const url = `${baseUrlCors}${dsConfig.apiUrlFrag}/accounts/${accountId}/envelopes`;
            return axios.post(url, envelopeObject, config)
        }) 
        .then (response => {
            // Created the envelope!
            const envelopeId = response.data.envelopeId;
            console.log (`Created envelope ${envelopeId}`);
            dispatch( sendSignEnvIdRecvd( envData, envelopeId ));
            dispatch( loadingStart( 'Creating the signing ceremony' ));
    
            const viewRecipientRequest = createViewRecipientRequest(envData)
                , url = `${baseUrlCors}${dsConfig.apiUrlFrag}/accounts/${accountId}/envelopes/${envelopeId}/views/recipient`;
            return axios.post(url, viewRecipientRequest, config)
        })
        .then( response => {
            // Next, redirect to the signing ceremony
            dispatch( loadingStart( 'Starting the signing ceremony' ));
            window.location.href = response.data.url;
        })
        .catch (err => {
            let message = err.message;
            if (err.response && err.response.data && err.response.data.error) {
                message += '; ' + err.response.data.error;
            }
            if (err.response && err.response.data && err.response.data.message) {
                message += '; ' + err.response.data.message;
            }
            console.log(message);

            dispatch( loadingStop());
            dispatch( showAlert (`Problem! ${message}`));                                
            dispatch( sendSignEnvError (message));
        })
    }
}

/**
 * 
 * @param {*} envData object. Contains elements {signer1Name, signer1Email, count}
 */
const createEnv = (envData) => {
    // The xylophoneOrder document has anchor text:
    // signer1name: /name1/
    // quantity: /q/
    // signer1 signature location: /sn1/

    // First, get the pdf. The pdf must be on the same origin
    // as this app's file due to same origin restrictions.
    // Or use a file server with CORS support.
    // return (
        // axios.get(dsConfig.xylophonePdf)
        // For this demo we will locally create an HTML source document
        // .then (pdf => {
            // Create the envelope object
            const signHere1 = {
                    anchorString: '/sn1/', anchorYOffset: '10', 
                    anchorUnits: 'pixels', anchorXOffset: '20',
                    documentId: '1'}
                , fullName = {
                    anchorString: '/name1/', anchorYOffset: '0', 
                    anchorUnits: 'pixels', anchorXOffset: '-5',
                    documentId: '1', bold: 'true', font: 'Calibri',
                    fontSize: 'Size14'}                
                , quantity = { // number tab
                    anchorString: '/q/', anchorYOffset: '-15', 
                    anchorUnits: 'pixels', anchorXOffset: '20',
                    documentId: '1', font: 'Calibri', fontSize: 'Size14',
                    locked: 'false', name: 'Quantity', tabLabel: 'Quantity',
                    value: envData.count}
                , recipientTabs = {fullNameTabs: [fullName], numberTabs: [quantity],
                    signHereTabs: [signHere1]}
                , signer1 = {clientUserId: dsConfig.clientUserId, // Setting the clientUserId enables embedded signing
                    email: envData.signer1Email,
                    name: envData.signer1Name,
                    recipientId: '1',
                    routingOrder: '1',
                    tabs: recipientTabs} // Additional authentication options could also be added here
                , recipients = {signers: [signer1]}
                , env = {
                    status: "sent",
                    emailSubject: "Xylophone order",
                    documents: [{
                        // For a pdf document:
                        // documentBase64: Buffer.from(pdf).toString('base64'),
                        // fileExtension: "pdf",
                        // For an HTML doc. 
                        // Note that an envelope can contain multiple docs of potentially different types
                        documentBase64: Buffer.from(htmlDoc()).toString('base64'),
                        fileExtension: "html",
                        documentId: "1",
                        name: "Xylophone order"
                    }],
                    recipients: recipients}
                ;
            return Promise.resolve(env)
        // }) // closes the "then" clause's function argument
    //)
}

/**
 * Returns an HTML document to be signed.
 * CSS files are not allowed, so need to use inline CSS
 */
const htmlDoc = () => {
    let font = "font-family:Calibri, sans-serif;",
        white = "color:white;";

    return `
    <!DOCTYPE html>
    <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="${font};margin-left:2em;">
        <h1 style="font-family: 'Trebuchet MS', Helvetica, sans-serif;
            color: darkblue;margin-bottom: 0;">World Wide Corp</h1>
        <h2 style="font-family: 'Trebuchet MS', Helvetica, sans-serif;
          margin-top: 0px;margin-bottom: 2.5em;font-size: 1em;
          color: darkblue;">Musical Instruments Division</h2>
        <h3 style="${white}">/name1/</h3>
        <h3>Thank you for your xylophone order!</h3>
        <h3>Quantity ordered: <span style="${white}">/q/</span></h3>
        <h3 style="margin-top:2.5em;">Agreed and signed:  <span style="${white}">/sn1/</span></h3>
        <p style="margin-top:3em;">
  Candy bonbon pastry jujubes lollipop wafer biscuit biscuit. Topping brownie sesame snaps sweet roll pie. Croissant danish biscuit soufflé caramels jujubes jelly. Dragée danish caramels lemon drops dragée. Gummi bears cupcake biscuit tiramisu sugar plum pastry. Dragée gummies applicake pudding liquorice. Donut jujubes oat cake jelly-o. Dessert bear claw chocolate cake gummies lollipop sugar plum ice cream gummies cheesecake.
        </p>
        <p style="margin-top:3em;">
  Candy bonbon pastry jujubes lollipop wafer biscuit biscuit. Topping brownie sesame snaps sweet roll pie. Croissant danish biscuit soufflé caramels jujubes jelly. Dragée danish caramels lemon drops dragée. Gummi bears cupcake biscuit tiramisu sugar plum pastry. Dragée gummies applicake pudding liquorice. Donut jujubes oat cake jelly-o. Dessert bear claw chocolate cake gummies lollipop sugar plum ice cream gummies cheesecake.
        </p>
        <!-- Note the anchor tags for the fields are white. -->
        </body>
    </html>
  `
}
  

/**
 * Create a recipient view request object
 * See https://developers.docusign.com/esign-rest-api/reference/Envelopes/EnvelopeViews/createRecipient
* @param {*} envData object. Contains elements {signer1Name, signer1Email, count}
 */
const createViewRecipientRequest = (envData) => {
    let req = {
        authenticationMethod: 'none', // What authentication did this
            // application perform to ascertain the identity of the 
            // signer? 
            // In addition to this application's authentication of the
            // signer, DocuSign can be used for additional authentication
            // steps. Eg shared secret, KBA, etc
        clientUserId: dsConfig.clientUserId,
        email: envData.signer1Email,
        userName: envData.signer1Name,
        returnUrl: dsConfig.redirectUri 
    }
    return req
}

const sendSignEnvStart = () => {
    return {
        type: actionTypes.SEND_SIGN_ENV_START,
    };    
}
const sendSignEnvIdRecvd = (envelopeId) => {
    return {
        type: actionTypes.SEND_SIGN_ENV_ID_RECVD,
        envelopeId: envelopeId
    };
}

const sendSignEnvError = (sendSignError) => {
    return {
        type: actionTypes.SEND_SIGN_ENV_ERROR,
        sendSignError: sendSignError
    };
}
