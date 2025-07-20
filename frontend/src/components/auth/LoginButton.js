import React from "react";

const LoginButton = () => {
  const handleLogin = () => {
    // Redirect to the login API route
    window.location.href = '/api/auth/login';
  };

  return <button onClick={handleLogin}>Log In</button>;
};

export default LoginButton;