import React from 'react';

interface RoleStepProps {
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
}

const RoleStep: React.FC<RoleStepProps> = ({ value, onChange, onNext }) => {
  return (
    <div className="space-y-4">
      <label className="block text-lg font-medium">What is your role?</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded p-2"
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
  className={`px-4 py-2 rounded ${
    value ? 'bg-blue-600 text-white' : 'bg-gray-400 text-gray-200 cursor-not-allowed'
  }`}
>
  Next
</button>
    </div>
  );
};

export default RoleStep;