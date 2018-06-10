# Example 2: OAuth Implicit Grant and React example

Repository: [eg-02-react-implicit-grant](https://github/docusign/eg-02-react-implicit-grant)

## Introduction

This example React application demonstrates:

* Using the
  [OAuth Implicit Grant](https://developers.docusign.com/esign-rest-api/guides/authentication/oauth2-implicit)
  flow with DocuSign.
* Using DocuSign from a React application. The application was bootstrapped
  with [Create React App](https://github.com/facebook/create-react-app).
  It has not been
  [ejected](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#npm-run-eject)
  from the bootstrap process.
* Embedded signing from a React application.
* Listing envelopes in an account from a React application.

## Installation

### Requirements

* Node v8.10 or later
* During development: Two CORS proxy gateways, one for
  **https://account-d.docusign.com/** and one for
  **https://demo.docusign.net/**
* During production: Two or more CORS proxy gateways, one for
  **https://account-d.docusign.com/** and one or more
  for the different production platforms used by the accounts
  of the application's DocuSign users.
  Eg **https://www.docusign.net/**, **https://na2.docusign.net/**,
  **https://eu.docusign.net/** etc.

See the
[CORS example repository](https://github.com/docusign/blog-create-a-CORS-gateway)
for information on creating a private CORS gateway.

### Installation steps
Download or clone this repository. Then:

````
cd eg-02-react-implicit-grant
npm install
````

There are two ways to configure the example's settings:
1. Edit the `dsConfig.js` file in the root directory
   of the example.
1. Set the environment variables before running the example with
   the React bootstrap server. Set (and export) these environment variables:

   REACT_APP_DS_CLIENT_ID -- the app's Integration Key

   REACT_APP_DS_OAUTH_CORS -- the URL for a CORS gateway for the DocuSign OAuth service.

   REACT_APP_DS_API_CORS -- the URL for a CORS gateway for the DocuSign esignature REST API service.

   REACT_APP_DS_REDIRECT_URI -- the URL for the application. This URL is added to the configuration settings of the Integration Key.

   The Create React app bootstrap process will automatically execute
   the file `.env.development` if it is present in the
   root directory. The file should include:
````
    REACT_APP_DS_CLIENT_ID="xxxxx"
    export REACT_APP_DS_CLIENT_ID

    ... etc.
````

   Setting environment variables enables you to configure the software
   without including your private information in the repository.

### Creating the Integration Key
Your DocuSign Integration Key must be configured for an
OAuth Implicit Grant flow:
* Check the **This is a mobile app.** setting.
* Create a **Redirect URIs** entry for the application's URL.
  This URL is also configured in the dsConfig.js file or the
  environment variables file.

  Note: If the application is not located at your server's
  root directory, then you will need to set the
  BrowserRouter's basename property in the index.js file.

## Running the application

### Development mode

Start the development server:

````
cd eg-02-react-implicit-grant
npm start
````

Then open a browser to http://localhost:3000

### Production
Follow the
[documentation](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#npm-run-build)
for building and deploying the application.

## Debugging

* Since the Create React App toolchain is used for this
  application,
  [Debugging in the editor](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#debugging-in-the-editor)
  is supported. Or your browser's standard inspector/debugger can be used.
* While in development mode, the application supports the
  [Redux DevTools Extension](http://extension.remotedev.io/)
  for Chrome, Firefox and other browsers.

## Support, Contributions, License

Submit support questions to [StackOverflow](https://stackoverflow.com). Use tag `docusignapi`.

Contributions via Pull Requests are appreciated.
All contributions must use the MIT License.

This repository uses the MIT license, see the
[LICENSE](https://github.com/docusign/eg-02-react-implicit-grant/blob/master/LICENSE) file.
