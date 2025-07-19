import React from "react";
import LoginButton from "./components/auth/LoginButton";
import LogoutButton from "./components/auth/LogoutButton";
import Profile from "./components/auth/Profile";
import ApiDemo from "./components/common/ApiDemo";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Auth0 React + Flask API Demo</h1>
      {!isAuthenticated ? <LoginButton /> : <LogoutButton />}
      <Profile />
      <ApiDemo />
    </div>
  );
}

export default App;
