import { useMsal, useMsalAuthentication } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { useCallback } from "react";

const useFetchAuthenticated = () => {
  const { instance } = useMsal();
  const { result, error: msalError } = useMsalAuthentication(
    InteractionType.Redirect,
    {
      ...{
        scopes: [
          "openid",
          "profile",
          "https://communifyb2c.onmicrosoft.com/7c1323a7-ac9e-4dea-b1df-e5649f03af28/Root.Private",
        ],
      },
      account: instance.getActiveAccount() ?? undefined,
      redirectUri: "/",
    },
  );

  let fetchAuthenticated: (
    input: RequestInfo | URL,
    init?: RequestInit,
  ) => Promise<Response> = () =>
    Promise.reject(new Error("No MsalAuthentication Result"));

  if (result === null) {
    console.error("MsalAuthentication Result not available");
  } else {
    console.info("MsalAuthentication Result available");

    fetchAuthenticated = (
      input: RequestInfo | URL,
      init?: RequestInit,
    ): Promise<Response> => {
      if (msalError) {
        return Promise.reject(new Error("MsalAuthentication Result"));
      }

      if (result === null) {
        return Promise.reject(new Error("No MsalAuthentication Result"));
      }

      const options = {
        ...init,
        headers: {
          ...init?.headers,
          ...{
            Authorization: `Bearer ${result.accessToken}`,
          },
        },
      };

      console.log("Fetch Authenticated", input, options);
      return fetch(input, options);
    };
  }

  return {
    result,
    fetchAuthenticated: useCallback(fetchAuthenticated, [result, msalError]),
  };
};

export default useFetchAuthenticated;
