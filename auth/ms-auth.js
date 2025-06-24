import { msalConfig } from './config.js';

const msalInstance = new msal.PublicClientApplication(msalConfig);

// scopes: ["User.Read", "User.ReadBasic.All"],

export const msalGetToken = (authScopes) => new Promise((resolve, reject) => {
    msalInstance.initialize().then(async () => {
        try {
            const redirectResponse = await msalInstance.handleRedirectPromise();

            // Post-Redirect
            if (redirectResponse !== null) {
                let accessToken = redirectResponse.accessToken;
                resolve(accessToken);

                // Pre-redirect
            } else {
                let account = '';
                try { account = msalInstance.getAllAccounts()[0]; }
                catch (error) { }

                const accessTokenRequest = {
                    scopes: authScopes,
                    account: account
                };

                // Silent Token
                msalInstance.acquireTokenSilent(accessTokenRequest)
                    .then((silentResp) => { resolve(silentResp.accessToken); })

                    .catch((silentError) => {
                        reject(silentError);
                        console.error(`Trying popup auth because redirect failed: ${silentError}`);

                        // Redirect
                        msalInstance.acquireTokenRedirect(accessTokenRequest)
                            .then((redirectResp) => { resolve(redirectResp.accessToken); })

                            .catch((redirectError) => {
                                reject(redirectError);
                                console.error(`Trying popup auth because redirect failed: ${error}`);

                                // Popup
                                msalInstance.acquireTokenPopup(accessTokenRequest)
                                    .then((popupResp) => { resolve(popupResp.accessToken); })
                                    .catch((popupError) => { reject(popupError); });
                            });

                    });
            }

        } catch (error) {
            console.error(`Auth flow failed: ${error}`);
            reject(error);
        }
    });
});