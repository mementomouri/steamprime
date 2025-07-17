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
    <div className="max-w-7xl mx-auto p-4 pt-32">
      <div className="flex justify-between items-center my-6">
        <header>
          {/* متن در اینجا تغییر کرد */}
          <h1 className="text-2xl font-bold text-gray-800">با ما بروز باشید</h1>
        </header>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-blue-800/60" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجوی نام محصول..."
            className="h-10 w-64 rounded-full bg-blue-100/30 backdrop-blur-sm border border-blue-200/40 pl-10 pr-4 text-sm text-blue-900 placeholder:text-blue-900/40 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />
        </div>
      </div>

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
                        <th className="p-3">گزینه</th>
                        <th className="p-3">رنگ</th>
                        <th className="p-3">حافظه</th>
                        <th className="p-3">گارانتی</th>
                        <th className="p-3">قیمت نقدی (تومان)</th>
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
