import React from "react";
import { useUser } from '@auth0/nextjs-auth0/client';

export default function TestLogout() {
  const { user, isLoading } = useUser();

  const handleLogout = () => {
    console.log('Logout button clicked');
    window.location.href = '/api/auth/logout?returnTo=' + encodeURIComponent(window.location.origin);
  };

  const handleLogout2 = () => {
    console.log('Logout button 2 clicked');
    window.location.href = '/api/auth/logout';
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Test Logout Page</h1>
      {user ? (
        <div>
          <p>Logged in as: {user.email}</p>
          <button onClick={handleLogout} style={{ margin: 10, padding: 10 }}>
            Logout with returnTo
          </button>
          <button onClick={handleLogout2} style={{ margin: 10, padding: 10 }}>
            Logout without returnTo
          </button>
        </div>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
} 