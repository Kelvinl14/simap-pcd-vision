import React from 'react';

export function AuthLogo() {
  return (
    <div className="flex justify-center mb-6">
      <div className="relative">
        {/* Main circle with accessibility icon */}
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            className="w-9 h-9"
          >
            {/* Wheelchair icon */}
            <circle cx="12" cy="5" r="2" fill="white" stroke="none" />
            <path d="M12 7v5" strokeLinecap="round" />
            <path d="M9 12h6" strokeLinecap="round" />
            <path d="M9 12v4a3 3 0 0 0 3 3h1" strokeLinecap="round" />
            <circle cx="9" cy="19" r="2" />
            <path d="M15 12v2l3 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {/* Green checkmark badge */}
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center border-2 border-white">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            className="w-3 h-3"
          >
            <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
