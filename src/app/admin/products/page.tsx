"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Product, Category, Price } from "@prisma/client";

// Define a more specific type for our product data
type ProductWithDetails = Product & {
  category: Category;
  prices: Price[];
};

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      setProducts(data);
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  const handleAddNewClick = () => {
    // در مراحل بعد این را پیاده‌سازی می‌کنیم
    alert('قابلیت افزودن محصول به زودی اضافه می‌شود.');
  };

  const handleEditClick = (product: ProductWithDetails) => {
    // در مراحل بعد این را پیاده‌سازی می‌کنیم
    alert(`ویرایش محصول: ${product.name}`);
  };

  const handleDeleteClick = (id: number) => {
    // در مراحل بعد این را پیاده‌سازی می‌کنیم
    alert(`حذف محصول با شناسه: ${id}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-extrabold md:text-2xl text-gray-900">
          مدیریت محصولات
        </h1>
        <Button onClick={handleAddNewClick}>افزودن محصول</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>لیست محصولات</CardTitle>
          <CardDescription>محصولات خود را اضافه، ویرایش یا حذف کنید.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نام محصول</TableHead>
                <TableHead>دسته‌بندی</TableHead>
                <TableHead>آخرین قیمت</TableHead>
                <TableHead>آخرین بروزرسانی</TableHead>
                <TableHead><span className="sr-only">عملیات</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center h-24">در حال بارگذاری...</TableCell></TableRow>
              ) : (
                products.map((product, index) => (
                  <TableRow key={product.id} className={index % 2 === 0 ? "bg-[#FFFFFF]" : "bg-[#E8F3FF]"}>
                    <TableCell className="font-bold">{product.name}</TableCell>
                    <TableCell>{product.category.name}</TableCell>
                    <TableCell>
                      {product.prices.length > 0
                        ? `${Number(product.prices[0].amount).toLocaleString('fa-IR')} تومان`
                        : 'قیمت‌گذاری نشده'}
                    </TableCell>
                    <TableCell>
                      {product.prices.length > 0
                        ? new Date(product.prices[0].createdAt).toLocaleDateString('fa-IR')
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(product)}>ویرایش</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteClick(product.id)} className="text-red-500 hover:!text-red-500">حذف</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}