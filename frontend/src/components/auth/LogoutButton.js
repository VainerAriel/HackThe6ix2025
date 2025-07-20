import React from "react";
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

const LogoutButton = () => {
  const { user } = useUser();

  return (
    <Link href="/api/auth/logout">
      <button>
        Log Out
      </button>
    </Link>
  );
};

export default LogoutButton;
