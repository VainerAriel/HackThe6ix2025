import React from 'react';

interface RoleStepProps {
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
}

const RoleStep: React.FC<RoleStepProps> = ({ value, onChange, onNext }) => {
  return (
    <div className="space-y-6">
      <label className="block text-lg font-semibold text-[#374151]">What is your role?</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-[#e5e7eb] rounded-lg p-3 text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all"
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
        className={`w-full px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:ring-offset-2 focus:ring-offset-white mt-2
          ${value ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white hover:from-[#7c3aed] hover:to-[#9333ea]' : 'bg-[#f3f4f6] text-[#9ca3af] cursor-not-allowed'}`}
      >
        Next
      </button>
    </div>
  );
};

export default RoleStep;