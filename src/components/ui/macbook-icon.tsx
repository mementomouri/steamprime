"use client";
import Image from "next/image";

export function MacbookIcon() {
  const handleMacbookClick = () => {
    // ارسال رویداد برای اسکرول به بخش MACBOOK
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('scrollToSection', { 
        detail: { categoryName: 'MACBOOK' }
      }));
    }
  };

  return (
    <button 
      onClick={handleMacbookClick}
      className="group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 touch-friendly"
      title="برو به بخش MACBOOK"
    >
      <Image 
        src="/MACBOOK.svg" 
        alt="Macbook" 
        width={40}
        height={40}
        className="w-8 h-8 sm:w-10 sm:h-10 transition-all duration-200 group-hover:scale-110"
      />
    </button>
  );
} 