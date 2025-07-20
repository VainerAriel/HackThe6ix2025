import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LoginPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center">
        <div className="text-[#6b7280] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col">
      {/* Header with Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] bg-clip-text text-transparent">
          PitchPerfect
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 space-y-8 text-center border border-[#e5e7eb]">
          <h2 className="text-3xl font-extrabold text-[#374151] tracking-tight">Welcome to <span className="bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] bg-clip-text text-transparent">PitchPerfect</span></h2>
          <p className="text-[#6b7280]">Sharpen your workplace conversation skills.</p>

          <div className="w-20 h-20 mx-auto rounded-full shadow-lg border-4 border-[#e5e7eb] bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>

          <Link href="/api/auth/login" className="w-full inline-block px-6 py-3 mt-4 bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white font-semibold rounded-lg shadow-lg hover:from-[#7c3aed] hover:to-[#9333ea] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:ring-offset-2 focus:ring-offset-white">
            Log in with Auth0
          </Link>

          <p className="text-xs text-[#9ca3af] mt-2">Secure login powered by <span className="text-[#8b5cf6] font-medium">Auth0</span></p>
        </div>
      </div>
    </div>
  );
}
