"use client";

import React from "react";
import GlassyCircleIcon from "./glassy-circle-icon";

interface ScrollToTopButtonProps {
  size?: "mobile" | "desktop";
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ size = "mobile" }) => {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const buttonClasses = size === "mobile" 
    ? "group flex items-center justify-center w-10 h-10 transition-all duration-300 hover:scale-105 touch-friendly"
    : "group flex items-center justify-center w-12 h-12 transition-all duration-300 hover:scale-105 touch-friendly";

  return (
    <button 
      onClick={handleScrollToTop}
      className={buttonClasses}
      title="بازگشت به بالا"
    >
      <GlassyCircleIcon />
    </button>
  );
};

export default ScrollToTopButton; 