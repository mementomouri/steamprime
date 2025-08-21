"use client";
import Image from "next/image";

export function PlayStationIcon() {
  const handlePlayStationClick = () => {
    const playstationSection = document.querySelector('[data-category="PLAYSTATION"]');
    if (playstationSection) {
      playstationSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <button 
      onClick={handlePlayStationClick}
      className="group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 touch-friendly"
      title="برو به بخش PLAYSTATION"
    >
      <Image 
        src="/PLAYSTATION.svg" 
        alt="PlayStation" 
        width={40}
        height={40}
        className="w-8 h-8 sm:w-10 sm:h-10 transition-all duration-200 group-hover:scale-110"
      />
    </button>
  );
} 