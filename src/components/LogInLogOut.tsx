import React from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { Button, Space } from "antd";

const LogInLogOut: React.FC = () => {
  const { instance } = useMsal();
  let activeAccount;

  if (instance) {
    activeAccount = instance.getActiveAccount();
  }

  const handleLoginRedirect = () => {
    instance
      .loginRedirect(loginRequest)
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  };
  const handleLogoutRedirect = () => {
    instance.logoutRedirect();
  };

  return (
    <>
      <UnauthenticatedTemplate>
        <Button type="primary" onClick={handleLoginRedirect}>
          Log in
        </Button>
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <Space>
          <span>
            {activeAccount && activeAccount.username
              ? activeAccount.username
              : "Unknown"}
          </span>
          <Button type="primary" onClick={handleLogoutRedirect}>
            Log out
          </Button>
        </Space>
      </AuthenticatedTemplate>
    </>
  );
};

export default LogInLogOut;
