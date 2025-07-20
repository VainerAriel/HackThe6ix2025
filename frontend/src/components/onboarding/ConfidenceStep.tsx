import React from 'react';

interface Props {
  value: number;
  onNext: () => void;
  onBack: () => void;
  onChange: (confidence: number) => void;
}

const ConfidenceStep: React.FC<Props> = ({ value, onNext, onBack, onChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#374151] mb-4">How confident are you in high-stakes conversations?</h2>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-[#6b7280]">Not confident</span>
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full accent-[#8b5cf6] bg-[#f3f4f6] rounded-lg h-2 appearance-none focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] transition-all"
        />
        <span className="text-sm text-[#6b7280]">Very confident</span>
      </div>
      <div className="mt-2 text-center bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] bg-clip-text text-transparent font-semibold">Confidence: {value}/10</div>
      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="text-sm text-[#6b7280] underline hover:text-[#8b5cf6] transition-all">Back</button>
        <button
          onClick={onNext}
          disabled={value === 0}
          className={`px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:ring-offset-2 focus:ring-offset-white
            ${value ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white hover:from-[#7c3aed] hover:to-[#9333ea]' : 'bg-[#f3f4f6] text-[#9ca3af] cursor-not-allowed'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ConfidenceStep;
