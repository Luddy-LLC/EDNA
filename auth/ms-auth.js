import { msalConfig } from './config.js';

const msalInstance = new msal.PublicClientApplication(msalConfig);


microsoftTeams.app.initialize().then(() => {
  microsoftTeams.app.getContext().then(context => {
    microsoftTeams.authentication.getAuthToken({
      successCallback: (token) => {
        console.log("SSO Token:", token);
      },
      failureCallback: (error) => {
        console.error("SSO failed, falling back to MSAL login", error);
      }
    });
  });
});


// const msalGetToken = new Promise((resolve, reject) => {
//     msalInstance.initialize().then(async () => {
//         const redirectResponse = await msalInstance.handleRedirectPromise();
//         try {
//             if (redirectResponse !== null) {

//                 let accessToken = redirectResponse.accessToken;
//                 resolve(accessToken);

//             } else {
//                 console.log(msalInstance.getAllAccounts());
//                 const account = msalInstance.getAllAccounts()[0];

//                 const accessTokenRequest = {
//                     scopes: ["User.Read","User.ReadBasic.All"],
//                     account: account,
//                 };

//                 msalInstance
//                     .acquireTokenSilent(accessTokenRequest)
//                     .then(function (accessTokenResponse) {
//                         let accessToken = accessTokenResponse.accessToken;
//                         resolve(accessToken);
//                     })
//                     .catch(function (error) {
//                         console.log(error);
//                         if (error) { //instanceof InteractionRequiredAuthError
//                             msalInstance.acquireTokenRedirect(accessTokenRequest);
//                         }
//                     });
//             }
//         } catch (error) {
//             reject(error);
//         }

//     });

// });

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

    async myPhoto() { return URL.createObjectURL(await this.get('me/photo/$value','blob')); }

    async userPhoto(upn) {return URL.createObjectURL(await this.get(`users/${upn}/photo/$value`,'blob'));}

    
}  

// document.querySelectorAll('[login]').forEach((el) => {
//     el.addEventListener("click", () => {
//         msalGetToken();
//     })
// })