import React from "react";
import ReactDOM from "react-dom/client";
import {
  AccountInfo,
  EventType,
  PublicClientApplication,
} from "@azure/msal-browser";
import { msalConfig } from "./authConfig.js";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { MsalProvider } from "@azure/msal-react";
import App from "./App";

const msalInstance = new PublicClientApplication(msalConfig);

// Default to using the first account if no account is active on page load
if (
  !msalInstance.getActiveAccount() &&
  msalInstance.getAllAccounts().length > 0
) {
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

msalInstance.addEventCallback((event) => {
  if (
    (event.eventType === EventType.LOGIN_SUCCESS ||
      event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
      event.eventType === EventType.SSO_SILENT_SUCCESS) &&
    event.payload
  ) {
    console.log(event);
    msalInstance.setActiveAccount(event.payload as AccountInfo);
  }
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <MsalProvider instance={msalInstance}>
    <App />
  </MsalProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
