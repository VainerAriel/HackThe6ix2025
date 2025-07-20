// components/onboarding/GoalStep.tsx
import React from 'react';

interface Props {
  value: string[];
  onBack: () => void;
  onNext: () => void;
  onChange: (goals: string[]) => void;
}

const goalsList = [
  'Improve speaking confidence',
  'Handle workplace conflict',
  'Ask for raises/promotions',
  'Navigate tough conversations',
  'General self-improvement',
];

const GoalStep: React.FC<Props> = ({ value, onBack, onNext, onChange }) => {
  const toggleGoal = (goal: string) => {
    if (value.includes(goal)) {
      onChange(value.filter((g) => g !== goal));
    } else {
      onChange([...value, goal]);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#374151] mb-4">What are your goals?</h2>
      <div className="grid gap-3">
        {goalsList.map((goal) => (
          <button
            key={goal}
            onClick={() => toggleGoal(goal)}
            className={`p-3 border rounded-lg text-left shadow-md transition-all duration-200
              ${value.includes(goal) ? 'border-[#8b5cf6] bg-[#f8fafc]' : 'border-[#e5e7eb] bg-white hover:border-[#8b5cf6] hover:bg-[#f8fafc]'}
              text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]`}
          >
            {goal}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="text-sm text-[#6b7280] underline hover:text-[#8b5cf6] transition-all">Back</button>
        <button
          onClick={onNext}
          disabled={value.length === 0}
          className={`px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:ring-offset-2 focus:ring-offset-white
            ${value.length ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white hover:from-[#7c3aed] hover:to-[#9333ea]' : 'bg-[#f3f4f6] text-[#9ca3af] cursor-not-allowed'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GoalStep;
