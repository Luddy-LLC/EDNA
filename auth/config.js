export const msalConfig = {
  auth: {
    clientId: "d7c6a2e3-5cef-4ca5-967a-3790bdc5e1dc",
    authority: "https://login.microsoftonline.com/1113be34-aed1-4d00-ab4b-cdd02510be91",
    // redirectUri: "https://luddy-llc.github.io/EDNA/",
    redirectUri: "http://127.0.0.1:3000/index.html",
    postLogoutRedirectUri: "https://luddy-llc.github.io/EDNA/logout"
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true
  },
  system: {
    allowRedirectInIframe: true
  }
};