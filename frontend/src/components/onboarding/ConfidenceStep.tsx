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
      <h2 className="text-xl font-semibold text-gray-100 mb-4">How confident are you in high-stakes conversations?</h2>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-400">Not confident</span>
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full accent-[#facc15] bg-gray-800 rounded-lg h-2 appearance-none focus:outline-none focus:ring-2 focus:ring-[#facc15] transition-all"
        />
        <span className="text-sm text-gray-400">Very confident</span>
      </div>
      <div className="mt-2 text-center text-[#facc15] font-semibold">Confidence: {value}/10</div>
      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="text-sm text-gray-400 underline hover:text-[#facc15] transition-all">Back</button>
        <button
          onClick={onNext}
          disabled={value === 0}
          className={`px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#facc15] focus:ring-offset-2 focus:ring-offset-gray-900
            ${value ? 'bg-[#facc15] text-gray-900 hover:bg-yellow-400' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ConfidenceStep;
