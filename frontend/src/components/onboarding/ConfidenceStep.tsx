import React from 'react';

interface Props {
  value: number;
  onNext: () => void;
  onBack: () => void;
  onChange: (confidence: number) => void;
}

const ConfidenceStep: React.FC<Props> = ({ value, onNext, onBack, onChange }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">How confident are you in high-stakes conversations?</h2>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">Not confident</span>
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full"
        />
        <span className="text-sm text-gray-600">Very confident</span>
      </div>
      <div className="mt-2 text-center text-blue-600 font-semibold">Confidence: {value}/10</div>
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

export default ConfidenceStep;
