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
      <h2 className="text-xl font-semibold text-gray-100 mb-4">What are your goals?</h2>
      <div className="grid gap-3">
        {goalsList.map((goal) => (
          <button
            key={goal}
            onClick={() => toggleGoal(goal)}
            className={`p-3 border rounded-lg text-left shadow-md transition-all duration-200
              ${value.includes(goal) ? 'border-[#facc15] bg-gray-800' : 'border-gray-700 bg-gray-900 hover:border-[#facc15]'}
              text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#facc15]`}
          >
            {goal}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="text-sm text-gray-400 underline hover:text-[#facc15] transition-all">Back</button>
        <button
          onClick={onNext}
          disabled={value.length === 0}
          className={`px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#facc15] focus:ring-offset-2 focus:ring-offset-gray-900
            ${value.length ? 'bg-[#facc15] text-gray-900 hover:bg-yellow-400' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GoalStep;
