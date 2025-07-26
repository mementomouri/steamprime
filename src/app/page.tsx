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
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 px-9 py-5 text-center">
          <h1 className="text-3xl font-bold text-blue-600 tracking-wider">
            MOBILE TIGER
          </h1>
          <p className="text-sm font-bold text-blue-500 mt-1 tracking-wide">
            لیست قیمت فروشگاه موبایل تایگر
          </p>
        </div>
      </div>
      <PriceListClient initialData={serializableData} />
      <footer className="w-full mt-12 py-8 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-center text-white text-base rounded-t-2xl shadow-xl">
        <div className="mb-2 flex items-center justify-center gap-2">
          <svg className="inline-block w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.418 0-8-5.373-8-10a8 8 0 1 1 16 0c0 4.627-3.582 10-8 10zm0-7a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
          </svg>
          <span>آدرس: تهران،خیابان سازمان برنامه شمالی پلاک 117</span>
        </div>
        <div className="opacity-90">تمام حقوق این وب سایت برای شرکت موبایل تایگر محفوظ است</div>
      </footer>
    </main>
  );
}