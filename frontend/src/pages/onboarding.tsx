import { useState } from 'react';
import RoleStep from '@/components/onboarding/RoleStep';
import BossTypeStep from '@/components/onboarding/BossTypeStep';
import ConfidenceStep from '@/components/onboarding/ConfidenceStep';
import GoalsStep from '@/components/onboarding/GoalsStep';

const steps = ["Role", "Boss Type", "Confidence", "Goals"];

export default function OnboardingPage() {
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

  const next = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prev = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ececec] px-4">
      <div className="w-full max-w-xl bg-gray-900 rounded-2xl shadow-xl p-8 space-y-8 border border-gray-800 transition-all hover:scale-103 hover:opacity-95 duration-600">
        <h1 className="text-2xl font-extrabold text-white mb-4 tracking-tight">Onboarding <span className="text-[#facc15]">({steps[currentStep]})</span></h1>
        <div className="mb-6 w-full bg-gray-800 rounded-full h-2">
          <div
            className="bg-[#facc15] h-2 rounded-full transition-all duration-300"
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
  );
}
