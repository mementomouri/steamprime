"use client";
import Image from "next/image";

export function SamsungIcon() {
  const handleSamsungClick = () => {
    const samsungSection = document.querySelector('[data-category="SAMSUNG"]');
    if (samsungSection) {
      samsungSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <button 
      onClick={handleSamsungClick}
      className="group flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 touch-friendly"
      title="برو به بخش SAMSUNG"
    >
      <Image 
        src="/Samsung_Logo.svg" 
        alt="Samsung" 
        width={28}
        height={28}
        className="w-6 h-6 sm:w-7 sm:h-7 transition-all duration-200 group-hover:scale-110"
      />
    </button>
  );
} 