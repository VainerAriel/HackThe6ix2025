import React from "react";
import LoginButton from "./components/auth/LoginButton";
import LogoutButton from "./components/auth/LogoutButton";
import Profile from "./components/auth/Profile";
import ApiDemo from "./components/common/ApiDemo";
import { useUser } from '@auth0/nextjs-auth0/client';

function App() {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Auth0 React + Flask API Demo</h1>
      {!user ? <LoginButton /> : <LogoutButton />}
      <Profile />
      <ApiDemo />
    </div>
  );
}

export default App;
