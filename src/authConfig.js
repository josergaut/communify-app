import { LogLevel } from "@azure/msal-browser";

export const b2cPolicies = {
  names: {
    communify: "B2C_1_communify",
  },
  authorities: {
    communify: {
      authority:
        "https://communifyb2c.b2clogin.com/communifyb2c.onmicrosoft.com/B2C_1_communify",
    },
  },
  authorityDomain: "https://communifyb2c.b2clogin.com",
};

export const msalConfig = {
  auth: {
    clientId: "7c1323a7-ac9e-4dea-b1df-e5649f03af28", // This is the ONLY mandatory field that you need to supply.
    authority: b2cPolicies.authorities.communify.authority, // Choose SUSI as your default authority.
    knownAuthorities: [b2cPolicies.authorityDomain], // Mark your B2C tenant's domain as trusted.
    redirectUri: "/", // You must register this URI on Azure Portal/App Registration. Defaults to window.location.origin
    postLogoutRedirectUri: "/", // Indicates the page to navigate after logout.
    navigateToLoginRequestUrl: false, // If "true", will navigate back to the original request location before processing the auth code response.
  },
  cache: {
    cacheLocation: "sessionStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },
};

export const protectedResources = {
  private: {
    endpoint: "http://localhost:8080/private",
    scopes: {
      private: [
        "https://communifyb2c.onmicrosoft.com/7c1323a7-ac9e-4dea-b1df-e5649f03af28/Root.Private",
      ],
    },
  },
};

export const loginRequest = {
  scopes: ["openid", "profile", ...protectedResources.private.scopes.private],
};
