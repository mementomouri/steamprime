"use client";

import React from 'react';

interface PriceDisplayProps {
  amount: string | number | null;
  discount?: string | number | null;
}

function formatCurrencyFa(amount: number): string {
  return new Intl.NumberFormat('fa-IR').format(amount);
}

export default function PriceDisplay({ amount, discount }: PriceDisplayProps) {
  const numericAmount = Number(amount ?? 0);
  const numericDiscount = Number(discount ?? 0);

  if (!amount) {
    return <div className="text-[#1E293B]">---</div>;
  }

  if (numericDiscount > 0) {
    const discountedPrice = numericAmount - (numericAmount * numericDiscount / 100);
    return (
      <div className="flex items-center justify-center gap-2">
        {/* ستون قیمت‌ها برای تراز عمودی */}
        <div className="flex flex-col items-end">
          <div className="text-green-600 font-bold text-base sm:text-lg">
            {formatCurrencyFa(discountedPrice)}
          </div>
          <div className="text-red-500 line-through text-xs opacity-75">
            {formatCurrencyFa(numericAmount)}
          </div>
        </div>
        {/* نشان تخفیف */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white text-xs w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-red-400 shrink-0">
          {numericDiscount}%
        </div>
      </div>
    );
  }

  return <div className="text-[#1E293B]">{formatCurrencyFa(numericAmount)}</div>;
}


