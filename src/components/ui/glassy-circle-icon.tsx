"use client";
import React from "react";

const GlassyCircleIcon: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-18 h-18 rounded-full overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 glassy-icon-wrapper">
      <svg
        className="w-full h-full p-4"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Glassy Circle */}
        <circle
          className="transition-all duration-300 glassy-circle"
          cx="50"
          cy="50"
          r="48"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="2"
          fill="url(#glassGradient)"
          style={{
            filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.1))'
          }}
        />
        
        {/* Inner Arrow Shape */}
        <path
          d="M 50 70 L 50 30 M 50 30 L 35 45 M 50 30 L 65 45"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          stroke="#3b82f6"
          className="transition-transform duration-300 ease-in-out glassy-arrow"
          style={{
            filter: 'drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2))'
          }}
        />
        
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.1)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default GlassyCircleIcon; 