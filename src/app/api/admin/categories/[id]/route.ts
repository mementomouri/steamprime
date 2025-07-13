import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// تابع برای ویرایش (Update) یک دسته‌بندی
export async function PUT(request: NextRequest) {
  try {
    // ID را مستقیماً از URL استخراج می‌کنیم
    const categoryId = Number(request.url.split('/').pop());
    if (isNaN(categoryId)) {
      return new NextResponse("Invalid Category ID", { status: 400 });
    }

    const body = await request.json();
    const { name, brandColor } = body;

    if (!name || !brandColor) {
      return new NextResponse("Name and brandColor are required", { status: 400 });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: { name, brandColor },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// تابع برای حذف یک دسته‌بندی
export async function DELETE(request: NextRequest) {
  try {
    // ID را مستقیماً از URL استخراج می‌کنیم
    const categoryId = Number(request.url.split('/').pop());
    if (isNaN(categoryId)) {
      return new NextResponse("Invalid Category ID", { status: 400 });
    }

    await prisma.category.delete({ where: { id: categoryId } });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}