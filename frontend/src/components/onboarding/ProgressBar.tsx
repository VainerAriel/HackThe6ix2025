import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-[#374151]">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-[#6b7280]">
          {Math.round(progress)}% Complete
        </span>
      </div>
      <div className="w-full bg-[#e5e7eb] rounded-full h-2">
        <div
          className="bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
