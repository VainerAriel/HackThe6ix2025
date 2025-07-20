import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";

// Helper function to get the best display name from Auth0 user
const getDisplayName = (user: any) => {
    // Priority order: nickname > name > email username > 'User'
    if (user.nickname && user.nickname.trim()) {
        return user.nickname;
    }
    if (user.name && user.name.trim()) {
        return user.name;
    }
    if (user.email) {
        // Extract username from email (before @)
        const emailUsername = user.email.split('@')[0];
        // Capitalize first letter
        return emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1);
    }
    return 'User';
};

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
        <div className="min-h-screen bg-gradient-to-br from-[#fafbfc] via-[#f8fafc] to-[#f1f5f9] flex flex-col relative overflow-hidden">
            {/* Multiple texture layers */}
            {/* Base dot pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23e5e7eb%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
            
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22grid%22%20width%3D%2220%22%20height%3D%2220%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M%2020%200%20L%200%200%200%2020%22%20fill%3D%22none%22%20stroke%3D%22%23e5e7eb%22%20stroke-width%3D%220.5%22%20opacity%3D%220.3%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20fill%3D%22url%28%23grid%29%22/%3E%3C/svg%3E')] opacity-20"></div>
            
            {/* Noise texture */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cfilter%20id%3D%22noise%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.9%22%20numOctaves%3D%224%22%20stitchTiles%3D%22stitch%22/%3E%3C/filter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url%28%23noise%29%22%20opacity%3D%220.05%22/%3E%3C/svg%3E')] opacity-15"></div>
            
            {/* Radial gradient overlay */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#f1f5f9]/30"></div>
            
            {/* Header with Logo and Logout */}
            <div className="flex justify-between items-center p-6 relative z-10">
                <div className="flex items-center space-x-2">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] bg-clip-text text-transparent">
                        PitchPerfect
                    </h1>
                </div>
                <Link
                    href="/api/auth/logout"
                    className="px-6 py-2 bg-white/80 backdrop-blur-sm border border-[#e5e7eb] text-[#6b7280] rounded-lg hover:bg-white hover:border-[#d1d5db] transition-all duration-200 shadow-sm"
                >
                    Logout
                </Link>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-20 pointer-events-none relative z-10">
                <div className="text-center max-w-2xl relative">
                    {/* Content background with texture */}
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-3xl shadow-2xl -z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/30 rounded-3xl -z-20"></div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f3f4f6%22%20fill-opacity%3D%220.3%22%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2220%22%20r%3D%220.5%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50 rounded-3xl -z-30"></div>
                    
                    <div className="p-16">
                    {/* Welcome Message */}
                    <h1 className="text-5xl md:text-6xl font-bold text-[#1f2937] mb-4 tracking-tight leading-tight text-center">
                        Welcome, <br className="hidden sm:block" />
                        <span className="bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] bg-clip-text text-transparent break-words">{getDisplayName(auth0User)}</span>
                    </h1>

                    {/* Slogan */}
                    <p className="text-xl text-[#6b7280] mb-12 font-light">
                        Pitch Smarter. Work Better.
                    </p>

                    {/* Get Started Button */}
                    <button
                        onClick={() => router.push('/onboarding')}
                        className="inline-block px-10 py-5 bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white font-semibold text-lg rounded-xl hover:from-[#7c3aed] hover:to-[#9333ea] transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl pointer-events-auto"
                    >
                        Get Started
                    </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 