"use client";

import { useState, useEffect } from 'react';
import type { Category, Product, Price } from "@prisma/client";

type PriceItem = Omit<Price, 'amount'> & { amount: string, dimensions?: string | null };
type ProductWithPrices = Omit<Product, 'prices'> & { prices: PriceItem[] };
type CategoryWithProducts = Omit<Category, 'products'> & { products: ProductWithPrices[] };

interface PriceListClientProps {
  initialData: CategoryWithProducts[];
}

export default function PriceListClient({ initialData }: PriceListClientProps) {
  const [filteredData, setFilteredData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setFilteredData(initialData);
  }, [initialData]);

  // گوش دادن به رویدادهای جستجو
  useEffect(() => {
    const handleSearchResults = (event: CustomEvent) => {
      const { filteredData: searchResults, searchTerm: term } = event.detail;
      setFilteredData(searchResults);
      setSearchTerm(term);
    };

    window.addEventListener('searchResults', handleSearchResults as EventListener);

    return () => {
      window.removeEventListener('searchResults', handleSearchResults as EventListener);
    };
  }, []);

  // گوش دادن به رویدادهای اسکرول به بخش
  useEffect(() => {
    const handleScrollToSection = (event: CustomEvent) => {
      const { categoryName } = event.detail;
      const section = document.querySelector(`[data-category="${categoryName}"]`);
      
      if (section) {
        // تنظیم offset برای قرارگیری زیر هدر
        const headerHeight = 120; // افزایش offset برای اطمینان از قرارگیری زیر هدر
        const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: sectionTop,
          behavior: 'smooth'
        });
      }
    };

    window.addEventListener('scrollToSection', handleScrollToSection as EventListener);

    return () => {
      window.removeEventListener('scrollToSection', handleScrollToSection as EventListener);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 pt-4 sm:pt-6 md:pt-8">
      {/* نمایش بخش فعال */}
      

      {/* نمایش وضعیت جستجو */}
      {searchTerm && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-blue-800">نتایج جستجو برای &quot;{searchTerm}&quot;</h3>
                <p className="text-xs sm:text-sm text-blue-600">
                  {filteredData.reduce((total, category) => total + category.products.length, 0)} محصول یافت شد
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilteredData(initialData);
                // ارسال رویداد برای پاک کردن جستجو
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('searchResults', { 
                    detail: { 
                      filteredData: initialData, 
                      searchTerm: ''
                    } 
                  }));
                }
              }}
              className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-xs sm:text-sm w-full sm:w-auto"
            >
              پاک کردن جستجو
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3 sm:space-y-4 md:space-y-8">
        {filteredData.length > 0 ? (
          filteredData.map((category) => (
            <section 
              key={category.id} 
              data-category={category.name}
              className={`transition-all duration-500 scroll-mt-32`}
            >
              <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center text-white p-3 sm:p-4 rounded-t-lg gap-2 sm:gap-3 ${category.brandColor || 'bg-gray-800'}`}>
                <h2 className="text-base sm:text-lg md:text-xl font-bold">{category.name}</h2>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 bg-blue-600/90 backdrop-blur-md border-2 border-blue-400 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl shadow-lg">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs sm:text-sm font-semibold text-white">
                        آخرین بروزرسانی:
                      </span>
                    </div>
                    <div className="bg-white/20 rounded-md px-3 py-1.5 border border-white/30">
                      <span className="text-xs sm:text-sm font-bold text-white">
                        {new Date(category.updatedAt).toLocaleString('fa-IR', { 
                          year: 'numeric',
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto bg-white shadow-md rounded-b-lg">
                <table className="min-w-full text-xs sm:text-sm text-center text-gray-800">
                   <thead className="bg-[#E8F3FF] text-[#1E293B] uppercase tracking-wider">
                      <tr>
                        <th className="p-3 md:p-4 text-right">گزینه</th>
                        <th className="p-3 md:p-4 text-center">رنگ</th>
                        <th className="p-3 md:p-4 text-center">حافظه</th>
                        <th className="p-3 md:p-4 text-center">گارانتی</th>
                        <th className="p-3 md:p-4 text-center">قیمت نقدی (تومان)</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y" style={{ borderColor: '#E2E8F0' }}>
                    {category.products.flatMap(p => p.prices).length > 0 ? (
                      category.products
                        .flatMap(product => product.prices.map(price => ({ product, price })))
                        .map(({ product, price }, index) => (
                          <tr
                            key={price.id}
                            className={`${index % 2 === 0 ? 'bg-[#FFFFFF]' : 'bg-[#E8F3FF]'} hover:bg-green-100`}
                          >
                            <td className="p-3 md:p-4 font-semibold text-xs sm:text-sm text-right text-[#1E293B]">{product.name}</td>
                            <td className="p-3 md:p-4 text-xs sm:text-sm text-[#1E293B]">{price.color || '-'}</td>
                            <td className="p-3 md:p-4 text-xs sm:text-sm text-[#1E293B]">{price.storage || '-'}</td>
                            <td className="p-3 md:p-4 text-xs sm:text-sm text-[#1E293B]">{price.warranty || '-'}</td>
                            <td className="p-3 md:p-4 font-bold text-[#1E293B] text-xs sm:text-sm md:text-base font-byekan">
                              {price.amount ? new Intl.NumberFormat('fa-IR').format(Number(price.amount)) : '---'}
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-3 sm:p-4 text-center text-gray-500 text-xs sm:text-sm">
                          محصولی برای نمایش در این دسته‌بندی وجود ندارد.
                        </td>
                      </tr>
                    )}
                   </tbody>
                </table>
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-8 sm:py-10 bg-white rounded-lg shadow-md">
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <div>
                <p className="text-lg sm:text-xl text-gray-600 font-semibold mb-1 sm:mb-2">نتیجه‌ای یافت نشد</p>
                <p className="text-gray-500 text-xs sm:text-sm">لطفاً عبارت جستجوی دیگری را امتحان کنید</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
