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
      <h2 className="text-xl font-semibold text-[#374151] mb-4">Choose Your Boss Personality</h2>
      <div className="grid gap-4">
        {bossTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onChange(type.value)}
            className={`p-4 border rounded-lg text-left shadow-md transition-all duration-200
              ${value === type.value ? 'border-[#8b5cf6] bg-[#f8fafc]' : 'border-[#e5e7eb] bg-white hover:border-[#8b5cf6] hover:bg-[#f8fafc]'}
              text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]`}
          >
            <div className="font-medium bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] bg-clip-text text-transparent">{type.label}</div>
            <div className="text-sm text-[#6b7280]">{type.description}</div>
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="text-sm text-[#6b7280] underline hover:text-[#8b5cf6] transition-all">Back</button>
        <button
          onClick={onNext}
          disabled={!value}
          className={`px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:ring-offset-2 focus:ring-offset-white
            ${value ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white hover:from-[#7c3aed] hover:to-[#9333ea]' : 'bg-[#f3f4f6] text-[#9ca3af] cursor-not-allowed'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BossTypeStep;
