import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { orderedIds } = await request.json();
    
    if (!orderedIds || !Array.isArray(orderedIds)) {
      return new NextResponse('Invalid data', { status: 400 });
    }

    const updatePromises = orderedIds.map((id: number, index: number) =>
      prisma.category.update({
        where: { id: id },
        data: { position: index },
      })
    );

    await prisma.$transaction(updatePromises);

    return NextResponse.json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error("Error reordering categories:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}