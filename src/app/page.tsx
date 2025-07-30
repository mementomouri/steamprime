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
      {/* هدر شیشه‌ای خالی */}
      <header className="w-full bg-white/20 backdrop-blur-xl border-b border-white/30 shadow-lg">
        <div className="max-w-6xl mx-auto py-6">
                     <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 px-4">
             <img 
               src="/logo.png" 
               alt="موبایل تایگر" 
               className="h-8 w-auto"
             />
             {/* سرچ‌بار جدید - مینیمال و آبی سفید */}
             <div className="flex-1 max-w-md">
               <div className="relative group">
                                   <input
                    type="text"
                    placeholder="search"
                    className="w-full h-12 px-5 pr-12 bg-white/90 backdrop-blur-sm border-2 border-blue-100 rounded-xl text-gray-700 placeholder:text-gray-400 text-sm font-medium shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white focus:shadow-md transition-all duration-200 outline-none hover:border-blue-200 hover:shadow-sm"
                    style={{ direction: 'rtl' }}
                  />
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6">
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
                 </div>
                 {/* افکت فوکوس */}
                 <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-blue-600/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
               </div>
             </div>
             
                           {/* شماره تماس */}
              <div className="flex items-center gap-2">
                <a 
                  href="tel:28421523" 
                  className="group flex items-center gap-3 bg-white/90 backdrop-blur-sm border-2 border-blue-500 px-4 py-2.5 rounded-xl text-blue-700 hover:bg-blue-50 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-base font-bold text-blue-800 tracking-wide">28421523</span>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </a>
              </div>
             
             {/* دکمه ثبت سفارش */}
             <div className="flex items-center w-full sm:w-auto">
               <button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-8 py-3 rounded-xl font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                 برای ثبت سفارش در اسرع وقت با ما تماس حاصل فرمایید
               </button>
             </div>
           </div>
        </div>
      </header>

             <PriceListClient initialData={serializableData} />
      
      {/* فوتر جدید - یکدست و مدرن */}
      <footer className="w-full mt-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* بخش اصلی فوتر */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* اطلاعات شرکت */}
            <div className="space-y-4">
                             <div className="flex items-center gap-3 mb-4">
                 <img 
                   src="/logo.png" 
                   alt="موبایل تایگر" 
                   className="h-8 w-auto brightness-0 invert"
                 />
               </div>
              <p className="text-blue-100 text-sm leading-relaxed">
                ارائه بهترین قیمت‌ها و خدمات با کیفیت در زمینه موبایل و لوازم جانبی
              </p>
            </div>

                         {/* اطلاعات تماس */}
             <div className="space-y-4">
               <h4 className="text-lg font-semibold mb-4">اطلاعات تماس</h4>
               <div className="space-y-3">
                 <div className="flex items-center gap-3 text-blue-100">
                   <svg className="w-5 h-5 text-blue-200 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                     <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                   </svg>
                   <span className="text-sm">تهران، خیابان سازمان برنامه شمالی پلاک 117</span>
                 </div>
                                   <div className="flex items-center gap-3 text-blue-100">
                    <svg className="w-5 h-5 text-blue-200 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                                       <span className="text-sm">09124936146</span>
                  </div>
                                   <div className="flex items-center gap-3 text-blue-100">
                    <svg className="w-5 h-5 text-blue-200 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">mehrad.tigerm@yahoo.com</span>
                  </div>
               </div>
             </div>

             {/* شبکه های اجتماعی */}
             <div className="space-y-4">
               <h4 className="text-lg font-semibold mb-4">شبکه های اجتماعی</h4>
               <div className="flex items-center gap-4">
                                   {/* اینستاگرام */}
                  <a href="https://instagram.com/mobile.tiger" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>

                                   {/* واتساپ */}
                  <a href="https://wa.me/989124936146" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </a>

                                   {/* تلگرام */}
                  <a href="https://t.me/mehrad_tiger" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </a>

                                   {/* تلفن */}
                  <a href="tel:09124936146" className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </a>
               </div>
             </div>

                         
          </div>

          {/* خط جداکننده */}
          <div className="border-t border-blue-500/30 mb-6"></div>

          {/* بخش کپی‌رایت */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-blue-100 text-sm text-center md:text-right">
              © 2024 تمام حقوق این وب‌سایت برای شرکت موبایل تایگر محفوظ است
            </div>
            <div className="flex items-center gap-6 text-blue-200">
              <a href="#" className="text-sm hover:text-white transition-colors duration-200">حریم خصوصی</a>
              <a href="#" className="text-sm hover:text-white transition-colors duration-200">قوانین و مقررات</a>
              <a href="#" className="text-sm hover:text-white transition-colors duration-200">درباره ما</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}