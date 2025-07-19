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
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Choose Your Boss Personality</h2>
      <div className="grid gap-4">
        {bossTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onChange(type.value)}
            className={`p-4 border rounded-lg text-left shadow-md transition-all duration-200
              ${value === type.value ? 'border-[#facc15] bg-gray-800' : 'border-gray-700 bg-gray-900 hover:border-[#facc15]'}
              text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#facc15]`}
          >
            <div className="font-medium text-[#facc15]">{type.label}</div>
            <div className="text-sm text-gray-400">{type.description}</div>
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="text-sm text-gray-400 underline hover:text-[#facc15] transition-all">Back</button>
        <button
          onClick={onNext}
          disabled={!value}
          className={`px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#facc15] focus:ring-offset-2 focus:ring-offset-gray-900
            ${value ? 'bg-[#facc15] text-gray-900 hover:bg-yellow-400' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BossTypeStep;
