"use client";

import { useState, useEffect, useRef } from 'react';
import type { Category, Product, Price } from "@prisma/client";

// این تایپ‌های جدید برای داده‌های سریالایز شده هستند
type SerializablePrice = Omit<Price, 'amount'> & { amount: string };
type SerializableProduct = Omit<Product, 'prices'> & { prices: SerializablePrice[] };
type SerializableCategory = Omit<Category, 'products'> & { products: SerializableProduct[] };

interface SearchBarProps {
  data: SerializableCategory[];
}

interface SearchResult {
  categoryName: string;
  productName: string;
  price: string;
  color?: string;
  storage?: string;
  warranty?: string;
}

export default function SearchBar({ data }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [allSearchResults, setAllSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // فیلتر کردن داده‌ها بر اساس جستجو
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setAllSearchResults([]);
      setIsSearching(false);
      setShowDropdown(false);
      // ارسال داده‌های اصلی
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('searchResults', { 
          detail: { 
            filteredData: data, 
            isSearching: false,
            searchTerm: ''
          } 
        }));
      }
      return;
    }

    setIsSearching(true);
    
    // جمع‌آوری تمام محصولات و قیمت‌ها
    const allResults: SearchResult[] = [];
    
    data.forEach(category => {
      category.products.forEach(product => {
        product.prices.forEach(price => {
          const searchText = `${product.name} ${product.description || ''} ${category.name}`.toLowerCase();
          const term = searchTerm.toLowerCase();
          
          if (searchText.includes(term)) {
            allResults.push({
              categoryName: category.name,
              productName: product.name,
              price: price.amount,
              color: price.color || undefined,
              storage: price.storage || undefined,
              warranty: price.warranty || undefined
            });
          }
        });
      });
    });

    // مرتب‌سازی بر اساس مرتبط‌ترین نتایج
    const sortedResults = allResults.sort((a, b) => {
      const aText = `${a.productName} ${a.categoryName}`.toLowerCase();
      const bText = `${b.productName} ${b.categoryName}`.toLowerCase();
      const term = searchTerm.toLowerCase();
      
      const aStartsWith = aText.startsWith(term);
      const bStartsWith = bText.startsWith(term);
      
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      
      return aText.localeCompare(bText);
    });

    setAllSearchResults(sortedResults);
    // نمایش فقط 5 نتیجه اول
    setSearchResults(sortedResults.slice(0, 5));
    setIsSearching(false);
    setShowDropdown(true);
  }, [searchTerm, data]);

  // بستن dropdown با کلیک خارج از آن
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleShowAllResults = () => {
    // ارسال تمام نتایج به لیست اصلی
    if (typeof window !== 'undefined') {
      // تبدیل نتایج به فرمت مورد نیاز لیست اصلی
      const filteredData = data.map(category => {
        const filteredProducts = category.products.filter(product => {
          const searchText = `${product.name} ${product.description || ''} ${category.name}`.toLowerCase();
          const term = searchTerm.toLowerCase();
          return searchText.includes(term);
        });
        
        return {
          ...category,
          products: filteredProducts
        };
      }).filter(category => category.products.length > 0);

      window.dispatchEvent(new CustomEvent('searchResults', { 
        detail: { 
          filteredData: filteredData, 
          isSearching: false,
          searchTerm: searchTerm
        } 
      }));
    }
    setShowDropdown(false);
  };

  return (
    <div className="flex-1 max-w-md" ref={searchRef}>
      <div className="relative group">
        <input
          type="text"
          placeholder="جستجو در محصولات..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.trim() && setShowDropdown(true)}
          className="w-full h-12 px-5 pr-12 bg-white/90 backdrop-blur-sm border-2 border-blue-100 rounded-xl text-gray-700 placeholder:text-gray-400 text-sm font-medium shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white focus:shadow-md transition-all duration-200 outline-none hover:border-blue-200 hover:shadow-sm"
          style={{ direction: 'rtl' }}
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6">
          {isSearching ? (
            <svg className="w-4 h-4 text-blue-500 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : (
            <svg 
              className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors duration-200" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" 
              />
            </svg>
          )}
        </div>
        
        {/* افکت فوکوس */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-blue-600/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
        
        {/* Dropdown نتایج جستجو */}
        {showDropdown && searchTerm.trim() && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-blue-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-center">
                <svg className="w-5 h-5 text-blue-500 animate-spin mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm text-gray-600">در حال جستجو...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="py-2">
                {searchResults.map((result, index) => (
                  <div 
                    key={index}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => {
                      setSearchTerm('');
                      setShowDropdown(false);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-sm">{result.productName}</div>
                        <div className="text-xs text-gray-500 mt-1">{result.categoryName}</div>
                        <div className="flex gap-2 mt-1">
                          {result.color && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                              {result.color}
                            </span>
                          )}
                          {result.storage && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                              {result.storage}
                            </span>
                          )}
                          {result.warranty && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                              {result.warranty}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-left mr-3">
                        <div className="font-bold text-red-600 text-sm">
                          {new Intl.NumberFormat('fa-IR').format(Number(result.price))} تومان
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* دکمه نمایش همه نتایج */}
                {allSearchResults.length > 5 && (
                  <div 
                    className="px-4 py-3 bg-blue-50 hover:bg-blue-100 cursor-pointer border-t border-blue-200"
                    onClick={handleShowAllResults}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-blue-700">نمایش همه نتایج</span>
                      <span className="text-xs text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
                        {allSearchResults.length} نتیجه
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 text-center">
                <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <span className="text-sm text-gray-600">نتیجه‌ای یافت نشد</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 