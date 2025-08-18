"use client";

import Image from "next/image";

export function AppleIcon() {
  const handleAppleClick = () => {
    const appleSection = document.querySelector('[data-category="APPLE"]');
    if (appleSection) {
      appleSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <button 
      onClick={handleAppleClick}
      className="group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 touch-friendly"
      title="برو به بخش Apple"
    >
      <svg 
        className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    </button>
  );
} 

export function AppleIconNothing() {
  const handleNothingClick = () => {
    const nothingSection = document.querySelector('[data-category="NOTHING"]');
    if (nothingSection) {
      nothingSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <button 
      onClick={handleNothingClick}
      className="group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 touch-friendly"
      title="برو به بخش nothing"
    >
      <Image
        src="/Nothing.svg"
        alt="Nothing"
        width={40}
        height={40}
        className="w-8 h-8 sm:w-10 sm:h-10 transition-all duration-200 group-hover:scale-110"
      />
    </button>
  );
} 

export function AppleIconGoogle() {
  const handleGoogleClick = () => {
    const googleSection = document.querySelector('[data-category="GOOGLE"]');
    if (googleSection) {
      googleSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <button 
      onClick={handleGoogleClick}
      className="group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 touch-friendly"
      title="برو به بخش google"
    >
      <Image
        src="/Google.svg"
        alt="Google"
        width={40}
        height={40}
        className="w-8 h-8 sm:w-10 sm:h-10 transition-all duration-200 group-hover:scale-110"
      />
    </button>
  );
} 

export function AppleIconXiaomi() {
  const handleXiaomiClick = () => {
    const xiaomiSection = document.querySelector('[data-category="XIAOMI"]');
    if (xiaomiSection) {
      xiaomiSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <button 
      onClick={handleXiaomiClick}
      className="group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 touch-friendly"
      title="برو به بخش XIAOMI"
    >
      <Image
        src="/Xiaomi.svg"
        alt="Xiaomi"
        width={40}
        height={40}
        className="w-8 h-8 sm:w-10 sm:h-10 transition-all duration-200 group-hover:scale-110"
      />
    </button>
  );
} 