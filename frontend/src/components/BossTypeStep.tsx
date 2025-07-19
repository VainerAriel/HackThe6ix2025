import React from 'react';

type BossType = {
  value: string;
  label: string;
  description: string;
};

const bossTypes: BossType[] = [
  {
    value: 'supportive',
    label: 'Supportive',
    description: 'Encouraging and team-oriented. Gives positive reinforcement.',
  },
  {
    value: 'micromanager',
    label: 'Micromanager',
    description: 'Closely oversees every detail. Wants constant updates.',
  },
  {
    value: 'dismissive',
    label: 'Dismissive',
    description: 'Minimal feedback. Often skeptical or uninterested.',
  },
  {
    value: 'demanding',
    label: 'Demanding',
    description: 'Results-driven. Expects high performance, fast.',
  },
];

interface Props {
  value: string;
  onNext: () => void;
  onBack: () => void;
  onChange: (bossType: string) => void;
}

const BossTypeStep: React.FC<Props> = ({ value, onNext, onBack, onChange }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Choose Your Boss Personality</h2>
      <div className="grid gap-4">
        {bossTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onChange(type.value)}
            className={`p-4 border rounded-lg text-left shadow-sm transition-all ${
              value === type.value ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
            }`}
          >
            <div className="font-medium">{type.label}</div>
            <div className="text-sm text-gray-600">{type.description}</div>
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="text-sm text-gray-600 underline">Back</button>
        <button
  onClick={onNext}
  disabled={!value}
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

export default BossTypeStep;
