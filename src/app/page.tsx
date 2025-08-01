import { prisma } from "@/lib/prisma";
import PriceListClient from "./PriceListClient";
import SearchBar from "./SearchBar";
import Image from "next/image";
import type { Category, Product, Price } from "@prisma/client";

export const revalidate = 60; // هر ۶۰ ثانیه یک بار داده‌ها را از نو می‌خواند

// این تایپ‌های جدید برای داده‌های سریالایز شده هستند
type SerializablePrice = Omit<Price, 'amount'> & { amount: string };
type SerializableProduct = Omit<Product, 'prices'> & { prices: SerializablePrice[] };
type SerializableCategory = Omit<Category, 'products'> & { products: SerializableProduct[] };

export default async function HomePage() {
  const categoriesWithProducts = await prisma.category.findMany({
    where: {
      isActive: true // فقط دسته‌بندی‌های فعال
    },
    include: {
      products: {
        include: {
          prices: { orderBy: { createdAt: 'desc' } },
        },
        orderBy: { position: 'asc' },
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
            <Image 
              src="/logo.png" 
              alt="موبایل تایگر" 
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            {/* سرچ‌بار جدید - مینیمال و آبی سفید */}
            <SearchBar data={serializableData} />
            
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
                برای ثبت سفارش با واتساپ موبایل تایگر در ارتباط باشید
              </button>
            </div>
          </div>
        </div>
      </header>

      <PriceListClient initialData={serializableData} />
      
      {/* فوتر جدید - یکدست و مدرن */}
      <footer className="w-full mt-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* بخش اصلی فوتر */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
            {/* اطلاعات شرکت */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <Image 
                  src="/logo.png" 
                  alt="موبایل تایگر" 
                  width={48}
                  height={48}
                  className="h-12 w-auto brightness-0 invert"
                />
              </div>
              <div className="space-y-6">
                <p className="text-blue-100 text-base leading-relaxed">
                  ارائه بهترین قیمت‌ها و خدمات با کیفیت در زمینه موبایل و لوازم جانبی
                </p>
                
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <h5 className="text-xl font-bold text-white mb-4">بیش از دو دهه اعتماد، همگام با فناوری</h5>
                  <p className="text-blue-100 text-base leading-relaxed mb-4">
                    برای بیش از ۲۰ سال، موبایل تایگر با افتخار در کنار شما بوده و تجربه‌ای بی‌نظیر را در دنیای پویای تلفن همراه به ارمغان آورده است. از زمانی که اولین تلفن‌های همراه راه خود را به زندگی روزمره ما باز کردند تا امروز که گوشی‌های هوشمند جزئی جدایی‌ناپذیر از وجودمان شده‌اند، ما همواره در تلاش بوده‌ایم تا با ارائه به‌روزترین محصولات، بهترین خدمات و پشتیبانی بی‌وقفه، پاسخگوی اعتماد بی‌دریغ شما باشیم.
                  </p>
                  <p className="text-blue-100 text-base leading-relaxed mb-4">
                    این ۲۰ سال، تنها یک عدد نیست؛ گواه تعهدی عمیق به کیفیت، نوآوری و رضایت مشتری است. ما شاهد تغییر و تحولات شگرف در صنعت موبایل بوده‌ایم و همواره خود را با این دگرگونی‌ها همراه کرده‌ایم تا اطمینان حاصل کنیم که شما همیشه به جدیدترین فناوری‌ها و بهترین تجربه‌ها دسترسی دارید.
                  </p>
                  <p className="text-blue-100 text-base leading-relaxed mb-4">
                    ما باور داریم که این رابطه دوطرفه، که بر پایه اعتماد متقابل بنا شده است، عامل اصلی موفقیت ماست. از اینکه در این مسیر طولانی همراه و حامی ما بوده‌اید، صمیمانه سپاسگزاریم.
                  </p>
                  <p className="text-white text-lg font-bold leading-relaxed">
                    موبایل تایگر: ۲۰ سال تجربه، ۲۰ سال اعتماد، همگام با آینده.
                  </p>
                </div>
              </div>
            </div>

            {/* اطلاعات تماس */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                اطلاعات تماس
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-4 text-blue-100 bg-white/5 rounded-xl p-4">
                  <svg className="w-6 h-6 text-blue-200 flex-shrink-0 mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <span className="text-base font-semibold text-white block mb-1">آدرس:</span>
                    <span className="text-base">تهران، خیابان سازمان برنامه شمالی پلاک 117</span>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-blue-100 bg-white/5 rounded-xl p-4">
                  <svg className="w-6 h-6 text-blue-200 flex-shrink-0 mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <span className="text-base font-semibold text-white block mb-1">تلفن:</span>
                    <span className="text-base">09124936146</span>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-blue-100 bg-white/5 rounded-xl p-4">
                  <svg className="w-6 h-6 text-blue-200 flex-shrink-0 mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <span className="text-base font-semibold text-white block mb-1">ایمیل:</span>
                    <span className="text-base">mehrad.tigerm@yahoo.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* شبکه های اجتماعی */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 4v2h6V4M9 4a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                شبکه های اجتماعی
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {/* اینستاگرام */}
                <a href="https://instagram.com/mobile.tiger" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl p-4 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                  <svg className="w-8 h-8 text-white mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span className="text-sm font-semibold text-white">اینستاگرام</span>
                </a>

                {/* واتساپ */}
                <a href="https://wa.me/989124936146" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                  <svg className="w-8 h-8 text-white mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  <span className="text-sm font-semibold text-white">واتساپ</span>
                </a>

                {/* تلگرام */}
                <a href="https://t.me/mehrad_tiger" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                  <svg className="w-8 h-8 text-white mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  <span className="text-sm font-semibold text-white">تلگرام</span>
                </a>

                {/* تلفن */}
                <a href="tel:09124936146" className="flex flex-col items-center justify-center bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                  <svg className="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm font-semibold text-white">تلفن</span>
                </a>
              </div>
              
              {/* شماره اضطراری */}
              <div className="flex items-center gap-4 text-red-200 bg-red-500/20 rounded-xl p-4 border border-red-400/30 mt-6">
                <svg className="w-8 h-8 text-red-300 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div className="flex flex-col">
                  <div className="mb-1">
                    <span className="text-lg font-bold text-red-200">شماره اضطراری:</span>
                    <span className="text-lg text-red-100 mr-2">09121240465</span>
                  </div>
                  <div>
                    <span className="text-base text-red-200">49-36-146</span>
                  </div>
                </div>
              </div>
            </div>

            {/* نحوه ثبت سفارش */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                نحوه ثبت سفارش
              </h4>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-start gap-4 text-blue-100 bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-400 rounded-full text-blue-900 text-sm font-bold flex-shrink-0 mt-1">1</div>
                  <div>
                    <span className="text-lg font-bold text-white block mb-2">انتخاب محصول</span>
                    <p className="text-base text-blue-100">محصول مورد نظر خود را از لیست قیمت انتخاب کنید</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-blue-100 bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-400 rounded-full text-blue-900 text-sm font-bold flex-shrink-0 mt-1">2</div>
                  <div>
                    <span className="text-lg font-bold text-white block mb-2">تماس با ما</span>
                    <p className="text-base text-blue-100">از طریق شماره‌های تماس یا شبکه‌های اجتماعی با ما در ارتباط باشید</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-blue-100 bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-400 rounded-full text-blue-900 text-sm font-bold flex-shrink-0 mt-1">3</div>
                  <div>
                    <span className="text-lg font-bold text-white block mb-2">تایید سفارش</span>
                    <p className="text-base text-blue-100">پس از تایید قیمت و موجودی، سفارش شما ثبت می‌شود</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-blue-100 bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-400 rounded-full text-blue-900 text-sm font-bold flex-shrink-0 mt-1">4</div>
                  <div>
                    <span className="text-lg font-bold text-white block mb-2">تحویل</span>
                    <p className="text-base text-blue-100">محصول در کمترین زمان ممکن به شما تحویل داده می‌شود</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* خط جداکننده */}
          <div className="border-t border-blue-500/30 mb-8"></div>

          {/* بخش کپی‌رایت */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-blue-100 text-base text-center md:text-right">
              © 2024 تمام حقوق این وب‌سایت برای شرکت موبایل تایگر محفوظ است
            </div>
            <div className="flex items-center gap-8 text-blue-200">
              <a href="#" className="text-base hover:text-white transition-colors duration-200">حریم خصوصی</a>
              <a href="#" className="text-base hover:text-white transition-colors duration-200">قوانین و مقررات</a>
              <a href="#" className="text-base hover:text-white transition-colors duration-200">درباره ما</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}