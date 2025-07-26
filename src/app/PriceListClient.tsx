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
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(initialData);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData(initialData);
      return;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    const newData = initialData
      .map(category => {
        const matchingProducts = category.products.filter(product =>
          product.name.toLowerCase().includes(lowercasedFilter)
        );
        if (matchingProducts.length > 0) {
          return { ...category, products: matchingProducts };
        }
        return null;
      })
      .filter((category): category is CategoryWithProducts => category !== null);

    setFilteredData(newData);
  }, [searchTerm, initialData]);

  return (
    <div className="max-w-7xl mx-auto p-4 pt-48">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between my-6 gap-2">
        {/* سرچ‌بار */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
          {/* سرچ‌بار برای دسکتاپ */}
          <div className="hidden sm:flex relative w-36">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="search"
              className="h-8 w-full rounded-2xl bg-white/30 backdrop-blur-xl border border-blue-200/40 pr-8 pl-2 text-xs font-bold text-blue-900 placeholder:text-blue-800/70 shadow-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 outline-none hover:shadow-xl"
              style={{ direction: 'rtl' }}
            />
            <button
              type="button"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-transparent text-blue-600 rounded-full p-1 shadow-none transition-all duration-200"
              tabIndex={-1}
              aria-label="جستجو"
            >
              <svg className="h-4 w-4 font-bold" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </div>
          {/* آیکون سرچ برای موبایل و مودال سرچ */}
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow transition-all duration-200 sm:hidden"
            aria-label="جستجو"
            onClick={() => setShowMobileSearch(true)}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        </div>
        
        {/* آیکون‌های اجتماعی */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
          {/* آیکون واتساپ */}
          <a
            href="https://wa.me/989124936146"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-green-600 hover:text-green-800 transition-colors duration-200 ease-in-out hover:scale-110 hover:shadow-lg hover:bg-green-50 rounded-lg px-2 py-1"
            style={{ textDecoration: 'none' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2 transition-transform duration-200 ease-in-out group-hover:scale-125">
              <path d="M20.52 3.48A12 12 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 5.98L0 24l6.22-1.63A11.97 11.97 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.77 0-3.5-.46-5.02-1.33l-.36-.21-3.69.97.99-3.59-.23-.37A9.97 9.97 0 0 1 2 12C2 6.48 6.48 2 12 2c2.61 0 5.06 1.02 6.92 2.88A9.77 9.77 0 0 1 22 12c0 5.52-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.34-.26.27-1 1-.99 2.43.01 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.22.69.24 1.23.38 1.65.49.69.18 1.32.15 1.82.09.56-.07 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" fill="currentColor"/>
            </svg>
            <span className="font-semibold">واتساپ</span>
          </a>
          {/* آیکون اینستا */}
          <a
            href="https://instagram.com/mobile.tiger"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-700 hover:text-pink-600 transition-colors duration-200 ease-in-out hover:scale-110 hover:shadow-lg hover:bg-blue-50 rounded-lg px-2 py-1"
            style={{ textDecoration: 'none' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2 transition-transform duration-200 ease-in-out group-hover:scale-125">
              <rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
            </svg>
            <span className="font-semibold">پیج اینستاگرام ما</span>
          </a>
        </div>
      </div>

      {/* مودال سرچ‌بار موبایل */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-4 w-11/12 max-w-sm shadow-lg flex flex-col gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="search"
              className="h-8 w-full rounded-2xl bg-white/30 backdrop-blur-xl border border-blue-200/40 pr-8 pl-2 text-xs font-bold text-blue-900 placeholder:text-blue-800/70 shadow-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 outline-none hover:shadow-xl"
              style={{ direction: 'rtl' }}
              autoFocus
            />
            <button
              className="text-blue-500 font-bold"
              onClick={() => setShowMobileSearch(false)}
            >
              بستن
            </button>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {filteredData.length > 0 ? (
          filteredData.map((category) => (
            <section key={category.id}>
              <div className={`flex justify-between items-center text-white p-3 rounded-t-lg ${category.brandColor || 'bg-gray-800'}`}>
                <h2 className="text-xl font-bold">{category.name}</h2>
                <span className="text-xs font-mono bg-black/20 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-full">
                  آخرین بروزرسانی: {new Date(category.updatedAt).toLocaleString('fa-IR', { dateStyle: 'short', timeStyle: 'short' })}
                </span>
              </div>
              <div className="overflow-x-auto bg-white shadow-md rounded-b-lg">
                <table className="min-w-full text-sm text-center text-gray-800">
                   <thead className="bg-gray-200 text-gray-600 uppercase tracking-wider">
                      <tr>
                        <th className="p-3 text-center">گزینه</th>
                        <th className="p-3 text-center">رنگ</th>
                        <th className="p-3 text-center">حافظه</th>
                        <th className="p-3 text-center">گارانتی</th>
                        <th className="p-3 text-center">قیمت نقدی (تومان)</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-200">
                    {category.products.flatMap(p => p.prices).length > 0 ? (
                      category.products.flatMap(product => product.prices.map(price => (
                        <tr key={price.id} className="hover:bg-gray-50">
                          <td className="p-3 font-semibold">{product.name}</td>
                          <td className="p-3">{price.color || '-'}</td>
                          <td className="p-3">{price.storage || '-'}</td>
                          <td className="p-3">{price.warranty || '-'}</td>
                          <td className="p-3 font-bold text-red-600 text-base">
                            {price.amount ? new Intl.NumberFormat('fa-IR').format(Number(price.amount)) : '---'}
                          </td>
                        </tr>
                      )))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-gray-500">
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
            <p className="text-xl text-gray-600">هیچ محصولی با عبارت جستجو شده یافت نشد.</p>
          </div>
        )}
      </div>
    </div>
  );
}
