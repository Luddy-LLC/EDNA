export const msalConfig = {
  auth: {
    clientId: "d7c6a2e3-5cef-4ca5-967a-3790bdc5e1dc",
    authority: "https://login.microsoftonline.com/1113be34-aed1-4d00-ab4b-cdd02510be91",
    redirectUri: "http://127.0.0.1:3000/index.html",
    postLogoutRedirectUri: "https://127.0.0.1:3000/logout.html"
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true
  }
};