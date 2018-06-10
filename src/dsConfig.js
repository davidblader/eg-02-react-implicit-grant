// DocuSign configuration settings

const dsConfig = {
    // Change to https://account.docusign.com for production
    oauthServer: "https://account-d.docusign.com",
    allowSilentLogin: true,
    clientId: process.env.REACT_APP_DS_CLIENT_ID || "client_id",
    oauthCORS: process.env.REACT_APP_DS_OAUTH_CORS || "url",
    dsApiCORS: process.env.REACT_APP_DS_API_CORS || "url",
    redirectUri: process.env.REACT_APP_DS_REDIRECT_URI || 'http://localhost:3000'
}

const oauthStartPath = "/oauth/auth?response_type=token&scope=signature";
    // See https://docs.docusign.com/esign/guide/authentication/oa2_implicit.html

dsConfig.oauth = dsConfig.oauthServer + oauthStartPath;
dsConfig.oauthLogout = dsConfig.oauthServer + 'logout';
dsConfig.apiUrlFrag = '/restapi/v2';
dsConfig.clientUserId = '123'; // Normally the id of the signer within your application/identity provider

if (!dsConfig.allowSilentLogin) {
    dsConfig.oauth += '&prompt=login'
}

export default dsConfig;