import { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0/client';
import RoleStep from '@/components/onboarding/RoleStep';
import BossTypeStep from '@/components/onboarding/BossTypeStep';
import ConfidenceStep from '@/components/onboarding/ConfidenceStep';
import GoalsStep from '@/components/onboarding/GoalsStep';
import ApiService from '@/lib/api';

const steps = ["Role", "Boss Type", "Confidence", "Goals"];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    bossType: '',
    confidence: 5,
    goals: [] as string[],
  });

  const updateFormData = (newData: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const getAccessToken = async () => {
    try {
      const response = await fetch('/api/auth/token');
      console.log('Token response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Token endpoint error:', response.status, errorText);
        throw new Error(`Token endpoint returned ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Token response data:', data);
      
      if (!data.accessToken) {
        throw new Error('No access token in response');
      }
      
      // Check if the token looks valid (should be a JWT or encrypted JWT)
      if (typeof data.accessToken !== 'string') {
        throw new Error('Invalid token format');
      }
      
      // Accept both standard JWT (3 parts) and encrypted JWT (5 parts)
      const tokenParts = data.accessToken.split('.');
      if (tokenParts.length !== 3 && tokenParts.length !== 5) {
        throw new Error('Invalid token format');
      }
      
      return data.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  };

  const saveOnboardingData = async () => {
    try {
      setIsSubmitting(true);
      
      const token = await getAccessToken();
      
      console.log('Got token, length:', token.length);
      console.log('Token preview:', token.substring(0, 50) + '...');
      
      const onboardingData = {
        boss_type: formData.bossType,
        role: formData.role,
        confidence: formData.confidence,
        goals: formData.goals,
      };

      await ApiService.updateOnboardingData(token, onboardingData);
      console.log('Onboarding data saved successfully');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      // Continue to chat page even if saving fails
    } finally {
      setIsSubmitting(false);
    }
  };

  const next = async () => {
    if (currentStep === steps.length - 1) {
      // If we're on the last step (Goals), save data and navigate to chat page
      await saveOnboardingData();
      router.push('/chat');
    } else {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };
  
  const prev = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  // Redirect to login if not authenticated
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#6b7280] text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfc]">
      {/* Header with Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] bg-clip-text text-transparent">
          PitchPerfect
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 space-y-8 border border-[#e5e7eb] transition-all hover:scale-103 hover:opacity-95 duration-600">
          <h2 className="text-2xl font-extrabold text-[#374151] mb-4 tracking-tight">Onboarding <span className="bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] bg-clip-text text-transparent">({steps[currentStep]})</span></h2>
          <div className="mb-6 w-full bg-[#f3f4f6] rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>

          <div className="pt-2">
            {currentStep === 0 && (
              <RoleStep value={formData.role} onNext={next} onChange={role => updateFormData({ role })} />
            )}
            {currentStep === 1 && (
              <BossTypeStep value={formData.bossType} onNext={next} onBack={prev} onChange={bossType => updateFormData({ bossType })} />
            )}
            {currentStep === 2 && (
              <ConfidenceStep value={formData.confidence} onNext={next} onBack={prev} onChange={confidence => updateFormData({ confidence })} />
            )}
            {currentStep === 3 && (
              <GoalsStep value={formData.goals} onNext={next} onBack={prev} onChange={goals => updateFormData({ goals })} />
            )}
          </div>

          {isSubmitting && (
            <div className="text-center text-sm text-[#6b7280]">
              Saving your preferences...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
