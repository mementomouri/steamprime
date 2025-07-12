import { prisma } from "@/lib/prisma";
import PriceListClient from "./PriceListClient";
import type { Category, Product, Price } from "@prisma/client";

export const revalidate = 60; // هر ۶۰ ثانیه یک بار داده‌ها را از نو می‌خواند

// این تایپ‌های جدید برای داده‌های سریالایز شده هستند
type SerializablePrice = Omit<Price, 'amount'> & { amount: string };
type SerializableProduct = Omit<Product, 'prices'> & { prices: SerializablePrice[] };
type SerializableCategory = Omit<Category, 'products'> & { products: SerializableProduct[] };

export default async function HomePage() {
  const categoriesWithProducts = await prisma.category.findMany({
    include: {
      products: {
        include: {
          prices: { orderBy: { createdAt: 'desc' } },
        },
        orderBy: { name: 'asc' },
      },
    },
    orderBy: { position: 'asc' },
  });

  // ===== مرحله کلیدی: تبدیل Decimal به string =====
  const serializableData: SerializableCategory[] = categoriesWithProducts.map(category => ({
    ...category,
    products: category.products.map(product => ({
      ...product,
      prices: product.prices.map(price => ({
        ...price,
        amount: price.amount.toString(), // تبدیل Decimal به string
      })),
    })),
  }));
  // ===============================================

  return (
    <main className="w-full min-h-screen bg-gray-100">
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 px-8 py-3">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-wider">
              <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
                MOBILE TIGER
              </span>
            </h1>
            <p className="text-xs font-medium text-gray-600 tracking-widest uppercase mt-1">
              راهنمای قیمت روز بازار
            </p>
          </div>
        </div>
      </div>

      <PriceListClient initialData={serializableData} />
    </main>
  );
}