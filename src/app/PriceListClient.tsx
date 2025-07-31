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
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setFilteredData(initialData);
  }, [initialData]);

  // گوش دادن به رویدادهای جستجو
  useEffect(() => {
    const handleSearchResults = (event: CustomEvent) => {
      const { filteredData: searchResults, isSearching: searching, searchTerm: term } = event.detail;
      setFilteredData(searchResults);
      setIsSearching(searching);
      setSearchTerm(term);
    };

    window.addEventListener('searchResults', handleSearchResults as EventListener);

    return () => {
      window.removeEventListener('searchResults', handleSearchResults as EventListener);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 pt-8 sm:pt-12">
      {/* نمایش وضعیت جستجو */}
      {searchTerm && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-blue-800">نتایج جستجو برای "{searchTerm}"</h3>
                <p className="text-sm text-blue-600">
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
                      isSearching: false,
                      searchTerm: ''
                    } 
                  }));
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
            >
              پاک کردن جستجو
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4 sm:space-y-8">
        {filteredData.length > 0 ? (
          filteredData.map((category) => (
            <section key={category.id}>
              <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center text-white p-3 rounded-t-lg gap-2 ${category.brandColor || 'bg-gray-800'}`}>
                <h2 className="text-lg sm:text-xl font-bold">{category.name}</h2>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="flex items-center gap-1 sm:gap-2 bg-white/15 backdrop-blur-md border border-white/30 sm:border-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl shadow-lg">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      آخرین بروزرسانی:
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-green-400">
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
              <div className="overflow-x-auto bg-white shadow-md rounded-b-lg">
                <table className="min-w-full text-xs sm:text-sm text-center text-gray-800">
                   <thead className="bg-gray-200 text-gray-600 uppercase tracking-wider">
                      <tr>
                        <th className="p-2 sm:p-3 text-right">گزینه</th>
                        <th className="p-2 sm:p-3 text-center">رنگ</th>
                        <th className="p-2 sm:p-3 text-center">حافظه</th>
                        <th className="p-2 sm:p-3 text-center">گارانتی</th>
                        <th className="p-2 sm:p-3 text-center">قیمت نقدی (تومان)</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-200">
                    {category.products.flatMap(p => p.prices).length > 0 ? (
                      category.products.flatMap(product => product.prices.map(price => (
                        <tr key={price.id} className="hover:bg-gray-50">
                          <td className="p-2 sm:p-3 font-semibold text-xs sm:text-sm text-right">{product.name}</td>
                          <td className="p-2 sm:p-3 text-xs sm:text-sm">{price.color || '-'}</td>
                          <td className="p-2 sm:p-3 text-xs sm:text-sm">{price.storage || '-'}</td>
                          <td className="p-2 sm:p-3 text-xs sm:text-sm">{price.warranty || '-'}</td>
                          <td className="p-2 sm:p-3 font-bold text-red-600 text-sm sm:text-base">
                            {price.amount ? new Intl.NumberFormat('fa-IR').format(Number(price.amount)) : '---'}
                          </td>
                        </tr>
                      )))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-gray-500 text-sm">
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
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <div className="flex flex-col items-center gap-4">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <div>
                <p className="text-xl text-gray-600 font-semibold mb-2">نتیجه‌ای یافت نشد</p>
                <p className="text-gray-500 text-sm">لطفاً عبارت جستجوی دیگری را امتحان کنید</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
