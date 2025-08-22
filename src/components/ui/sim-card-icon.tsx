"use client";
import Image from "next/image";

export function SimCardIcon() {
  const handleSimCardClick = () => {
    // ارسال رویداد برای اسکرول به بخش سیم کارت
    if (typeof window !== 'undefined') {
      // جستجو برای نام‌های مختلف دسته‌بندی سیم کارت
      const simCardSection = document.querySelector('[data-category="SIM CARD"]') || 
                            document.querySelector('[data-category="sim card"]') ||
                            document.querySelector('[data-category="Sim Card"]') ||
                            document.querySelector('[data-category="سیم کارت"]');
      
      if (simCardSection) {
        const categoryName = simCardSection.getAttribute('data-category');
        window.dispatchEvent(new CustomEvent('scrollToSection', { 
          detail: { categoryName }
        }));
      } else {
        // اگر بخش سیم کارت پیدا نشد، به اولین بخش برو
        const firstSection = document.querySelector('[data-category]');
        if (firstSection) {
          const categoryName = firstSection.getAttribute('data-category');
          window.dispatchEvent(new CustomEvent('scrollToSection', { 
            detail: { categoryName }
          }));
        }
      }
    }
  };

  return (
    <button 
      onClick={handleSimCardClick}
      className="group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 touch-friendly"
      title="برو به بخش سیم کارت"
    >
      <Image 
        src="/MCINET.svg" 
        alt="سیم کارت" 
        width={40}
        height={40}
        className="w-8 h-8 sm:w-10 sm:h-10 transition-all duration-200 group-hover:scale-110"
      />
    </button>
  );
} 