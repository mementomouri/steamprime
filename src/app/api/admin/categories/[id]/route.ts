import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// PUT (Update) a specific category
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const { name, brandColor } = await request.json();

    if (!name || !brandColor) {
      return new NextResponse('Missing name or brandColor', { status: 400 });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: { name, brandColor },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE a specific category
export async function DELETE(request: Request, { params }: Params) {
  try {
    await prisma.category.delete({
      where: { id: Number(params.id) },
    });
    return new Response(null, { status: 204 }); // 204 No Content
  } catch (error) {
    console.error("Error deleting category:", error);
    // این خطا ممکن است زمانی رخ دهد که دسته‌بندی برای حذف پیدا نشود
    return new Response(JSON.stringify({ message: 'خطا در حذف یا دسته‌بندی یافت نشد' }), { status: 500 });
  }
}