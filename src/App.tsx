import React, { useState } from "react";
import "./index.css";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import LogInLogOut from "./components/LogInLogOut";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import Profile from "./components/Profile";
import PatreonRedirect from "./components/PatreonRedirect";

const { Header, Sider, Content } = Layout;

const CustomPerks: React.FC = () => <p>Custom perks</p>;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Router>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <AuthenticatedTemplate>
            <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
              <Menu.Item key="1">
                <UserOutlined />
                <span>Profile</span>
                <Link to="/" />
              </Menu.Item>
            </Menu>
          </AuthenticatedTemplate>
        </Sider>
        <Layout style={{ minHeight: "100vh" }}>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <LogInLogOut />
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <AuthenticatedTemplate>
              <Routes>
                <Route path="/" element={<Profile />} />
                <Route path="/patreon-redirect" element={<PatreonRedirect />} />
              </Routes>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
              <p>Autenticate para poder usar la aplicación</p>
            </UnauthenticatedTemplate>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
