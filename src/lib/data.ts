// مسیر فایل: src/lib/data.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function fetchCategories() {
  console.log('Fetching categories from database...');
  try {
    const categories = await prisma.category.findMany();
    return categories;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch categories.');
  }
}