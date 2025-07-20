import { useState } from 'react';
import { useRouter } from 'next/router';
import RoleStep from '@/components/onboarding/RoleStep';
import BossTypeStep from '@/components/onboarding/BossTypeStep';
import ConfidenceStep from '@/components/onboarding/ConfidenceStep';
import GoalsStep from '@/components/onboarding/GoalsStep';

const steps = ["Role", "Boss Type", "Confidence", "Goals"];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    role: '',
    bossType: '',
    confidence: 5,
    goals: [] as string[],
  });

  const updateFormData = (newData: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const next = () => {
    if (currentStep === steps.length - 1) {
      // If we're on the last step (Goals), navigate to chat page
      router.push('/chat');
    } else {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };
  const prev = () => setCurrentStep(prev => Math.max(prev - 1, 0));

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
        </div>
      </div>
    </div>
  );
}
