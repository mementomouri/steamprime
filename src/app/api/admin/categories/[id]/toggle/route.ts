import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // بررسی احراز هویت
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await params;
    const categoryId = parseInt(id);
    
    // اعتبارسنجی ID
    if (isNaN(categoryId) || categoryId <= 0) {
      return new NextResponse('Invalid category ID', { status: 400 });
    }

    // بررسی وجود دسته‌بندی
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true, isActive: true }
    });

    if (!existingCategory) {
      return new NextResponse('Category not found', { status: 404 });
    }

    // تغییر وضعیت فعال/غیرفعال
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: { 
        isActive: !existingCategory.isActive,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        isActive: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      message: `Category ${updatedCategory.isActive ? 'activated' : 'deactivated'} successfully`,
      category: updatedCategory
    });
  } catch (error) {
    console.error("Error toggling category status:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 