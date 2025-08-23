"use client";

import React from 'react';

interface LiquidGlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary" | "success";
}

const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({ 
  children, 
  onClick, 
  size = "medium",
  variant = "primary" 
}) => {

  const handleClick = () => {
    // Scroll to top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Call the onClick prop if provided
    if (onClick) {
      onClick();
    }
  };

  // Size variants
  const sizeClasses = {
    small: "py-2 px-4 text-sm",
    medium: "py-3 px-6 text-base",
    large: "py-4 px-8 text-lg"
  };

  // Color variants
  const colorVariants = {
    primary: {
      background: "from-[#455def] to-[#455def]",
      overlay: "from-[#455def]/30 to-[#455def]/30",
      ring: "focus:ring-[#455def]"
    },
    secondary: {
      background: "from-[#455def] to-[#455def]",
      overlay: "from-[#455def]/30 to-[#455def]/30",
      ring: "focus:ring-[#455def]"
    },
    success: {
      background: "from-[#455def] to-[#455def]",
      overlay: "from-[#455def]/30 to-[#455def]/30",
      ring: "focus:ring-[#455def]"
    }
  };

  const currentVariant = colorVariants[variant];

  return (
    <div className="relative">
      {/* The background for the button to show the blur effect */}
      <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${currentVariant.background} opacity-70 blur-xl`}></div>
      
      {/* The main button component */}
              <button
          onClick={handleClick}
          className={`relative z-10 ${sizeClasses[size]} font-bold rounded-full transition-all duration-300 transform 
                     hover:scale-105 focus:outline-none focus:ring-4 ${currentVariant.ring} focus:ring-opacity-50
                     overflow-hidden touch-friendly`}
        style={{
          // CSS for the liquid glass effect
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)", // For Safari support
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <span className="relative z-10 flex items-center justify-center text-white font-medium">
          {children}
        </span>
        
        {/* Animated gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${currentVariant.overlay} animate-pulse-slow rounded-full`}
          style={{ mixBlendMode: "overlay" }}
        ></div>
      </button>


    </div>
  );
};

export default LiquidGlassButton; 