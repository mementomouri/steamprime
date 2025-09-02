"use client";

import React, { useEffect, useRef, useState } from 'react';

interface LiquidGlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary" | "success" | "blue";
}

const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({ 
  children, 
  onClick, 
  size = "medium",
  variant = "primary" 
}) => {

  const [showClickRing, setShowClickRing] = useState(false);
  const ringTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    // Show ring on click, hide after 3 seconds
    setShowClickRing(true);
    if (ringTimeoutRef.current) {
      clearTimeout(ringTimeoutRef.current);
    }
    ringTimeoutRef.current = setTimeout(() => {
      setShowClickRing(false);
    }, 2000);

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

  useEffect(() => {
    return () => {
      if (ringTimeoutRef.current) {
        clearTimeout(ringTimeoutRef.current);
      }
    };
  }, []);

  // Size variants
  const sizeClasses = {
    small: "py-2 px-4 text-sm",
    medium: "py-3 px-6 text-base",
    large: "py-4 px-8 text-lg"
  };

  // Color variants
  const colorVariants = {
    primary: {
      background: "from-[#1e3a8a] via-[#312e81] to-[#4c1d95]",
      overlay: "from-[#2563eb]/25 to-[#8b5cf6]/25",
      ring: "focus:ring-[#1e3a8a]"
    },
    secondary: {
      background: "from-[#0c4a6e] to-[#0a3a57]",
      overlay: "from-[#06b6d4]/25 to-[#0ea5e9]/25",
      ring: "focus:ring-[#0c4a6e]"
    },
    success: {
      background: "from-[#14532d] to-[#064e3b]",
      overlay: "from-[#16a34a]/25 to-[#22c55e]/25",
      ring: "focus:ring-[#14532d]"
    },
    blue: {
      background: "from-[#172aff] to-[#0f1bff]",
      overlay: "from-[#172aff]/25 to-[#0f1bff]/25",
      ring: "focus:ring-[#172aff]"
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
                     hover:scale-105 focus:outline-none ${showClickRing ? `ring-4 ${currentVariant.ring} ring-opacity-50` : ''}
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