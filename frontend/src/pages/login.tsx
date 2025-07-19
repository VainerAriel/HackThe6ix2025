import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#1c1c1c] flex items-center justify-center px-4">
      <div className="bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-8 space-y-8 text-center border border-gray-800">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome to <span className="text-[#facc15]">PitchPerfect</span></h1>
        <p className="text-gray-300">Sharpen your workplace conversation skills.</p>

        <img
          src="/chat-icon.png"
          alt="AI Chat Icon"
          className="w-20 h-20 mx-auto rounded-full shadow-lg border-4 border-gray-800 bg-[#232323]"
        />

        <Link href="/api/auth/login" legacyBehavior>
          <a className="w-full inline-block px-6 py-3 mt-4 bg-[#facc15] text-gray-900 font-semibold rounded-lg shadow-md hover:bg-yellow-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#facc15] focus:ring-offset-2 focus:ring-offset-gray-900">
            Log in with Auth0
          </a>
        </Link>

        <p className="text-xs text-gray-500 mt-2">Secure login powered by <span className="text-indigo-400 font-medium">Auth0</span></p>
      </div>
    </div>
  );
}
