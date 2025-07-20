import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUser as useCustomUser } from "../hooks/useUser";
import Link from "next/link";
import AuthDebug from "../components/auth/AuthDebug";

export default function Dashboard() {
  const { user: auth0User, isLoading: auth0Loading } = useUser();
  const { profile, isLoading: profileLoading, error, isSynced, syncUserWithDatabase } = useCustomUser();
  const router = useRouter();
  const [syncStatus, setSyncStatus] = useState<string>('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!auth0Loading && !auth0User) {
      router.push('/login');
    }
  }, [auth0User, auth0Loading, router]);

  const handleSync = async () => {
    setSyncStatus('Syncing...');
    try {
      await syncUserWithDatabase();
      setSyncStatus('Synced successfully!');
      setTimeout(() => setSyncStatus(''), 3000);
    } catch (error) {
      setSyncStatus('Sync failed!');
      setTimeout(() => setSyncStatus(''), 3000);
    }
  };

  if (auth0Loading || profileLoading) {
    return (
      <div className="min-h-screen bg-[#1c1c1c] flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Loading your dashboard...</div>
          <div className="text-gray-400 text-sm">Setting up your session</div>
        </div>
      </div>
    );
  }

  if (!auth0User) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-[#1c1c1c] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gray-900 rounded-2xl shadow-xl p-6 mb-6 border border-gray-800">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-white">Welcome, {auth0User.name}!</h1>
              <p className="text-gray-300 mt-2">Your PitchPerfect Dashboard</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleSync}
                disabled={profileLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {profileLoading ? 'Syncing...' : 'Sync Profile'}
              </button>
              <Link
                href="/api/auth/logout"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>

        {/* Sync Status */}
        {syncStatus && (
          <div className="bg-gray-900 rounded-2xl shadow-xl p-4 mb-6 border border-gray-800">
            <div className={`text-center ${syncStatus.includes('failed') ? 'text-red-400' : 'text-green-400'}`}>
              {syncStatus}
            </div>
          </div>
        )}

        {/* User Profile Section */}
        <div className="bg-gray-900 rounded-2xl shadow-xl p-6 mb-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-4">User Profile</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Auth0 Profile */}
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Auth0 Profile</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  {auth0User.picture && (
                    <img
                      src={auth0User.picture}
                      alt={auth0User.name || 'Profile'}
                      className="w-16 h-16 rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-white font-medium">{auth0User.name}</p>
                    <p className="text-gray-400">{auth0User.email}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  <p><strong>Email Verified:</strong> {auth0User.email_verified ? 'Yes' : 'No'}</p>
                  <p><strong>Auth0 ID:</strong> {auth0User.sub}</p>
                </div>
              </div>
            </div>

            {/* Database Profile */}
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Database Profile</h3>
              {error && !error.includes('401') ? (
                <div className="text-red-400 text-sm">
                  Error: {error}
                </div>
              ) : profile ? (
                <div className="space-y-3">
                  <div className="text-sm text-gray-400">
                    <p><strong>Database ID:</strong> {profile.user_id}</p>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Created:</strong> {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Updated:</strong> {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div className={`inline-block px-2 py-1 rounded text-xs ${isSynced ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                    {isSynced ? 'Synced with Database' : 'Not Synced'}
                  </div>
                </div>
              ) : (
                <div className="text-yellow-400 text-sm">
                  Profile not synced with database yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Debug Section */}
        <div className="bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-4">Debug Information</h2>
          <AuthDebug />
        </div>

        {/* Navigation */}
        <div className="bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/chat"
              className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              <div className="text-lg font-semibold">Start Chat</div>
              <div className="text-sm opacity-90">Practice conversations</div>
            </Link>
            <Link
              href="/onboarding"
              className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
            >
              <div className="text-lg font-semibold">Onboarding</div>
              <div className="text-sm opacity-90">Complete your profile</div>
            </Link>
            <button
              onClick={handleSync}
              className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center"
            >
              <div className="text-lg font-semibold">Sync Data</div>
              <div className="text-sm opacity-90">Update database</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 