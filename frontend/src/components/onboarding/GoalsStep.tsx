// components/onboarding/GoalStep.tsx
import React from 'react';

interface Props {
  value: string[];  // Fixes error 1
  onBack: () => void;
  onNext: () => void;
  onChange: (goals: string[]) => void;  // Fixes error 2
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
    <div>
      <h2 className="text-xl font-semibold mb-4">What are your goals?</h2>
      <div className="grid gap-3">
        {goalsList.map((goal) => (
          <button
            key={goal}
            onClick={() => toggleGoal(goal)}
            className={`p-3 border rounded-lg text-left shadow-sm transition-all ${
              value.includes(goal) ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
            }`}
          >
            {goal}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="text-sm text-gray-600 underline">Back</button>
        <button
          onClick={onNext}
          disabled={value.length === 0}
          className={`px-4 py-2 rounded ${
            value ? 'bg-blue-600 text-white' : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          Next
        </button>
        </div>
    </div>
  );
};

export default GoalStep;
