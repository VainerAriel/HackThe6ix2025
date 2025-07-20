import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const { user: auth0User, isLoading: auth0Loading } = useUser();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!auth0Loading && !auth0User) {
      router.push('/login');
    }
  }, [auth0User, auth0Loading, router]);

  if (auth0Loading) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#6b7280] text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!auth0User) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col">
      {/* Header with Logo and Logout */}
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] bg-clip-text text-transparent">
            PitchPerfect
          </h1>
        </div>
        <Link
          href="/api/auth/logout"
          className="px-6 py-2 bg-transparent border border-[#e5e7eb] text-[#6b7280] rounded-lg hover:bg-[#f3f4f6] hover:border-[#d1d5db] transition-all duration-200"
        >
          Logout
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-20">
        <div className="text-center max-w-md">
          {/* Welcome Message */}
          <h1 className="text-5xl font-semibold text-[#374151] mb-4 tracking-wide">
            Welcome, {auth0User.name}
          </h1>
          
          {/* Slogan */}
          <p className="text-lg text-[#6b7280] mb-12 italic">
            Pitch Smarter. Work Better.
          </p>
          
          {/* Start Questionnaire Button */}
          <Link
            href="/onboarding"
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white font-medium rounded-lg hover:from-[#7c3aed] hover:to-[#9333ea] transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Start Questionnaire
          </Link>
        </div>
      </div>
    </div>
  );
} 