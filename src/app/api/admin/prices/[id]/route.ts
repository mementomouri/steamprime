import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// تابع برای ویرایش (Update) یک قیمت
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const priceId = Number(id);
    
    if (isNaN(priceId) || priceId <= 0) {
      return new NextResponse(JSON.stringify({ message: "Invalid Price ID" }), { status: 400 });
    }

    const body = await request.json();
    const { name, description, productId, categoryId, amount, color, storage, warranty, label } = body;

    // بررسی وجود قیمت
    const existingPrice = await prisma.price.findUnique({
      where: { id: priceId },
    });

    if (!existingPrice) {
      return new NextResponse(JSON.stringify({ message: "Price not found" }), { status: 404 });
    }

    // اگر فقط amount ارسال شده باشد (ویرایش مستقیم قیمت)
    if (amount !== undefined && !name && !productId && !categoryId) {
      if (isNaN(Number(amount)) || Number(amount) <= 0) {
        return new NextResponse(JSON.stringify({ message: "Invalid amount" }), { status: 400 });
      }

      await prisma.price.update({
        where: { id: priceId },
        data: { amount: Number(amount) },
      });

      return NextResponse.json({ message: 'Price updated successfully' });
    }

    // ویرایش کامل (همه فیلدها)
    if (!name || !amount || !productId || !categoryId) {
      return new NextResponse(JSON.stringify({ message: "Required fields are missing" }), { status: 400 });
    }

    // بررسی وجود محصول و دسته‌بندی
    const [product, category] = await Promise.all([
      prisma.product.findUnique({ where: { id: Number(productId) } }),
      prisma.category.findUnique({ where: { id: Number(categoryId) } })
    ]);

    if (!product) {
      return new NextResponse(JSON.stringify({ message: "Product not found" }), { status: 404 });
    }

    if (!category) {
      return new NextResponse(JSON.stringify({ message: "Category not found" }), { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: Number(productId) },
        data: { name, description: description || null },
      });
      await tx.price.update({
        where: { id: priceId },
        data: { 
          amount: Number(amount), 
          color: color || null, 
          storage: storage || null, 
          warranty: warranty || null, 
          label: label || 'اصلی' 
        },
      });
      await tx.category.update({
        where: { id: Number(categoryId) },
        data: { updatedAt: new Date() },
      });
    });

    return NextResponse.json({ message: 'Update successful' });
  } catch (error) {
    console.error("Error updating data:", error);
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}

// تابع برای حذف یک قیمت
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const priceId = Number(id);
    
    if (isNaN(priceId) || priceId <= 0) {
      return new NextResponse(JSON.stringify({ message: "Invalid Price ID" }), { status: 400 });
    }

    // بررسی وجود قیمت
    const existingPrice = await prisma.price.findUnique({
      where: { id: priceId },
      select: { product: { select: { categoryId: true } } },
    });

    if (!existingPrice) {
      return new NextResponse(JSON.stringify({ message: "Price not found" }), { status: 404 });
    }
    
    const categoryId = existingPrice.product.categoryId;
    
    await prisma.$transaction(async (tx) => {
      await tx.price.delete({ where: { id: priceId } });
      await tx.category.update({
        where: { id: categoryId },
        data: { updatedAt: new Date() },
      });
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting price:", error);
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}