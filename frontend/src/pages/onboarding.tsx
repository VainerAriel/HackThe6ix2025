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
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Onboarding ({steps[currentStep]})</h1>
      <div className="mb-6 w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-yellow-500 h-2 rounded-full"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        ></div>
      </div>

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
  );
}
