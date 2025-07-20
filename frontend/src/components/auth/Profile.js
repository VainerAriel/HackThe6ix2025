import React from "react";
import { useUser } from '@auth0/nextjs-auth0/client';

const Profile = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading ...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    user && (
      <div>
        <img src={user.picture} alt={user.name} style={{ width: 50, borderRadius: "50%" }} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
};

export default Profile;
