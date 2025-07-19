import React from 'react';

interface RoleStepProps {
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
}

const RoleStep: React.FC<RoleStepProps> = ({ value, onChange, onNext }) => {
  return (
    <div className="space-y-6">
      <label className="block text-lg font-semibold text-gray-100">What is your role?</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#facc15] transition-all"
      >
        <option value="">Select a role</option>
        <option value="engineer">Engineer</option>
        <option value="designer">Designer</option>
        <option value="manager">Manager</option>
        <option value="sales">Sales</option>
      </select>
      <button
        onClick={onNext}
        disabled={!value}
        className={`w-full px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#facc15] focus:ring-offset-2 focus:ring-offset-gray-900 mt-2
          ${value ? 'bg-[#facc15] text-gray-900 hover:bg-yellow-400' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
      >
        Next
      </button>
    </div>
  );
};

export default RoleStep;