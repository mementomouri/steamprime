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

  useEffect(() => {
    setFilteredData(initialData);
  }, [initialData]);

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 pt-8 sm:pt-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between my-4 sm:my-6 gap-2">

      </div>

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
                        <th className="p-2 sm:p-3 text-center">گزینه</th>
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
                          <td className="p-2 sm:p-3 font-semibold text-xs sm:text-sm">{product.name}</td>
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
            <p className="text-xl text-gray-600">هیچ محصولی با عبارت جستجو شده یافت نشد.</p>
          </div>
        )}
      </div>
    </div>
  );
}
