import { msalConfig } from './config.js';

const msalInstance = new msal.PublicClientApplication(msalConfig);
var ul = document.getElementById('debug');
function debugLog(line, string) {
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(`LINE ${String(line)} : ${JSON.stringify(string)}`));
    ul.appendChild(li);
}


let account = '';
let redirectResponse = '';

const msalGetToken = new Promise((resolve, reject) => {
    msalInstance.initialize().then(async () => {
        try { 
            redirectResponse = await msalInstance.handleRedirectPromise(); 
            debugLog(19, redirectResponse);
        } catch (error) { 
            debugLog(21, `redirectResponse failed with error: ${error}`);
        }


        try {
            
            if (redirectResponse !== null) { //This handles the case that a redirect was performed and the page is being re-visited after the redirect.
                let accessToken = redirectResponse.accessToken; 
                resolve(accessToken);
                debugLog(30, `redirectResponse has access token: ${accessToken}`);
            } else { //This means a redirect was NOT just performed
                debugLog(32, `A redirect was NOT just performed. Attempting to get token...`);

                try {
                    debugLog(35, `trying to get acounts`);
                    account = msalInstance.getAllAccounts()[0];
                    debugLog(37, `account: ${account.username}`);
                    document.getElementById('username').innerText = account.username;
                }
                catch (error) {
                    debugLog(41, `could not get account with error: ${error}`);
                }

                const accessTokenRequest = {
                    scopes: ["User.Read", "User.ReadBasic.All"],
                    account: account,
                };

                debugLog(49, `trying to get silent token`);
                msalInstance.acquireTokenSilent(accessTokenRequest)
                    .then((accessTokenResponse) => {
                        debugLog(52, `accessTokenRequest ${accessTokenRequest === null ? 'is NULL' : 'has a value!'}`);
                        resolve(accessTokenResponse.accessToken);
                        debugLog(54, `silent token: ${accessTokenResponse.accessToken}`);
                    })
                    .catch((error) => {
                        debugLog(57, `Silent token acquisition failed: ${error}`);
                        
                        try {
                            // debugLog(66, `Redirect token acquisition failed: ${error}`);
                            debugLog(67, `Trying popup...`);
                            msalInstance.acquireTokenPopup(accessTokenRequest)
                                .then((popupResponse) => {
                                    debugLog(70, `popup response: ${popupResponse}`);
                                    resolve(popupResponse.accessToken);
                                    debugLog(72, `popup token: ${popupResponse.accessToken}`);
                                })
                                .catch((popupError) => {
                                    debugLog(66, `popup token acquisition failed: ${popupError}`);
                                    reject(popupError);
  
                                    // setTimeout(() => {
                                    //     document.getElementById('email').innerText = "67 - Trying Redirect.......";
                                    //     msalInstance.acquireTokenRedirect(accessTokenRequest).then((redirectResponse) => {
                                    //         resolve(redirectResponse.accessToken);
                                    //         document.getElementById('other').innerText = redirectResponse.accessToken;
                                    //         window.alert(redirectResponse.accessToken);
                                    //     }, 3000);

                                    // })
                                });
                        } catch (error) {
                            debugLog(58, `Trying redirect...`);
                            msalInstance.acquireTokenRedirect(accessTokenRequest).then((redirectResponse) => {
                                debugLog(62, `Redirect response: ${redirectResponse}`);
                                resolve(redirectResponse.accessToken);
                                debugLog(64, `Redirect token: ${redirectResponse.accessToken}`);
                            })
                        }
                    });
            }
        } catch (error) {
            document.getElementById('username').innerText = `89 - rejected: whole thing failed: ${error}`;
            reject(error);
        }
    });
});







export class GraphAPI {

    constructor() { }

    async get(endpoint, type = "json") {
        const url = `https://graph.microsoft.com/v1.0/${endpoint}`;

        try {
            const token = await msalGetToken;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }
            switch (type) {
                case "json":
                    return await response.json();
                case "text":
                    return await response.text();
                case "blob":
                    return await response.blob();
                case "arrayBuffer":
                    return await response.arrayBuffer();
                case "formData":
                    return await response.formData();
                default:
                    return await response.json();
            }

        } catch {

        }


    }


    async post(endpoint, data) {
        const url = `https://graph.microsoft.com/v1.0/${endpoint}`;

        try {
            const token = await msalGetToken;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error("Graph API error:", error);
            throw error;
        }
    }

    async me() { return await this.get('me'); }

    async myPhoto() { return URL.createObjectURL(await this.get('me/photo/$value', 'blob')); }

    async userPhoto(upn) { return URL.createObjectURL(await this.get(`users/${upn}/photo/$value`, 'blob')); }


}

document.querySelectorAll('[login]').forEach((el) => {
    el.addEventListener("click", () => {
        msalGetToken();
    })
})