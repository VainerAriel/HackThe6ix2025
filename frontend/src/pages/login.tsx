import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to PitchPerfect</h1>
        <p className="text-gray-500">Sharpen your workplace conversation skills.</p>

        <img
          src="/chat-icon.png"
          alt="AI Chat Icon"
          className="w-24 h-24 mx-auto"
        />

        <Link href="/api/auth/login" legacyBehavior>
          <a className="w-full inline-block px-6 py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-all">
            Log in with Auth0
          </a>
        </Link>

        <p className="text-sm text-gray-400 mt-2">Secure login powered by Auth0</p>
      </div>
    </div>
  );
}
