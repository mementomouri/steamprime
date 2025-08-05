"use client";
import Image from "next/image";

export function SimCardIcon() {
  const handleSimCardClick = () => {
    const simCardSection = document.querySelector('[data-category="sim card"]');
    if (simCardSection) {
      simCardSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <button 
      onClick={handleSimCardClick}
      className="group flex items-center justify-center w-13 h-13 rounded-lg bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
      title="برو به بخش سیم کارت"
    >
      <Image 
        src="/MCINET.svg" 
        alt="سیم کارت" 
        width={36}
        height={36}
        className="w-9 h-9 transition-all duration-200 group-hover:scale-110"
      />
    </button>
  );
} 