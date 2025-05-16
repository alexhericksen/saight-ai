import React from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

export function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        aria-pressed={checked}
        onClick={onChange}
        className={`relative w-8 h-4.5 rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-green-500' : 'bg-gray-300'}`}
        style={{ minWidth: 32, minHeight: 18 }}
      >
        <span
          className={`absolute left-0 top-0 w-4.5 h-4.5 bg-white rounded-full shadow transform transition-transform duration-200 ${checked ? 'translate-x-3.5' : ''}`}
          style={{ minWidth: 18, minHeight: 18 }}
        />
      </button>
      {label && (
        <span className="text-[10px] text-gray-400 mt-0.5 leading-tight text-center">{label}</span>
      )}
    </div>
  );
} 