import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#1c1c1c] flex items-center justify-center px-4">
      <div className="bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-8 space-y-8 text-center border border-gray-800">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          <span className="text-[#facc15]">PitchPerfect</span> Dashboard
        </h1>
        <p className="text-gray-300">Choose where you&apos;d like to go:</p>

        <div className="space-y-4">
          <Link 
            href="/login" 
            className="w-full inline-block px-6 py-4 bg-[#facc15] text-gray-900 font-semibold rounded-lg shadow-md hover:bg-yellow-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#facc15] focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Login
          </Link>

          <Link 
            href="/onboarding" 
            className="w-full inline-block px-6 py-4 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 border border-gray-600"
          >
            Onboarding
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Navigate to get started with PitchPerfect
        </p>
      </div>
    </div>
  );
} 