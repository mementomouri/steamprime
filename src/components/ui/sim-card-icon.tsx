"use client";
import Image from "next/image";

export function SimCardIcon() {
  const handleSimCardClick = () => {
    // جستجو برای نام‌های مختلف دسته‌بندی سیم کارت
    const simCardSection = document.querySelector('[data-category="SIM CARD"]') || 
                          document.querySelector('[data-category="sim card"]') ||
                          document.querySelector('[data-category="Sim Card"]') ||
                          document.querySelector('[data-category="سیم کارت"]');
    
    if (simCardSection) {
      simCardSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // اگر بخش سیم کارت پیدا نشد، به بالای لیست قیمت برو
      const priceListSection = document.querySelector('[data-category]');
      if (priceListSection) {
        priceListSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  return (
    <button 
      onClick={handleSimCardClick}
      className="group flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 touch-friendly"
      title="برو به بخش سیم کارت"
    >
      <Image 
        src="/MCINET.svg" 
        alt="سیم کارت" 
        width={28}
        height={28}
        className="w-6 h-6 sm:w-7 sm:h-7 transition-all duration-200 group-hover:scale-110"
      />
    </button>
  );
} 