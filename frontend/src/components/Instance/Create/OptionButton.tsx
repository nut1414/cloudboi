// components/Common/OptionButton.tsx
import React from 'react';

interface OptionButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

const OptionButton: React.FC<OptionButtonProps> = ({ label, isSelected, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
        ${isSelected 
          ? 'bg-purple-600 text-white border border-purple-500' 
          : 'bg-[#23375F] text-gray-300 border border-blue-800/30 hover:bg-blue-800'}
      `}
    >
      {icon && <span className={isSelected ? 'text-white' : 'text-purple-400'}>{icon}</span>}
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default OptionButton;
