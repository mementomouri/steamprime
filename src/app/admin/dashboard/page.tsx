"use client"; 

import { useState, useEffect, useCallback } from "react";
import toast from 'react-hot-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { AddProductDialog, type EditableItem } from "./AddProductDialog";
import type { Category, Product, Price } from "@prisma/client";

// گسترش تایپ‌ها برای پشتیبانی از فیلدهای جدید
type PriceWithDetails = Price & { dimensions?: string | null };
type ProductWithPrices = Product & { prices: PriceWithDetails[] };
type CategoryWithProducts = Category & { products: ProductWithPrices[] };

export default function DashboardPage() {
  const [categories, setCategories] = useState<CategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EditableItem | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/products');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to fetch data');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDeletePrice = async (priceId: number) => {
    const promise = new Promise<void>(async (resolve, reject) => {
      if (window.confirm('آیا از حذف این ردیف قیمت مطمئن هستید؟')) {
        try {
          const response = await fetch(`/api/admin/prices/${priceId}`, { method: 'DELETE' });
          if (!response.ok) {
            const errorData = await response.json();
            reject(new Error(errorData.details || 'خطا در حذف قیمت'));
            return;
          }
          fetchItems();
          resolve();
        } catch (err) {
          reject(err);
        }
      } else {
        reject(new Error("Operation cancelled"));
      }
    });

    toast.promise(promise, {
      loading: 'در حال حذف...',
      success: 'قیمت با موفقیت حذف شد!',
      error: (err) => err.message === "Operation cancelled" ? "عملیات لغو شد." : `خطا: ${err.toString()}`,
    });
  };
  
  const handleEditClick = (product: Product, price: PriceWithDetails) => {
    setEditingItem({ product, price });
    setIsDialogOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  if (loading) return <div className="p-8 text-center">در حال بارگذاری اطلاعات...</div>;
  if (error) return <div className="p-8 text-center text-red-500">خطا: {error}</div>;

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-extrabold md:text-2xl text-gray-900">مدیریت محصولات</h1>
        <Button onClick={handleAddNewClick} className="font-bold">افزودن آیتم جدید</Button>
      </div>

      <div className="mt-4">
        <Accordion type="single" collapsible className="w-full">
            {categories.map((category) => (
              <AccordionItem value={category.id.toString()} key={category.id}>
                <AccordionTrigger className="text-xl font-bold bg-gray-100 px-4 rounded-md border">
                  {category.name}
                </AccordionTrigger>
                <AccordionContent className="p-2">
                  <div className="rounded-lg border shadow-sm">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>نام محصول</TableHead>
                          <TableHead>برچسب قیمت</TableHead>
                          <TableHead>ابعاد</TableHead>
                          <TableHead className="text-right">قیمت (تومان)</TableHead>
                          <TableHead><span className="sr-only">عملیات</span></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {category.products.flatMap(p => p.prices).length > 0 ? (
                          category.products.flatMap(product => product.prices.map(price => (
                            <TableRow key={price.id}>
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell>{price.label || 'اصلی'}</TableCell>
                              <TableCell>{price.dimensions || '-'}</TableCell>
                              <TableCell className="text-right font-bold">
                                {price.amount ? new Intl.NumberFormat('fa-IR').format(Number(price.amount)) : '---'}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleEditClick(product, price)}>ویرایش</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDeletePrice(price.id)} className="text-red-600">حذف</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          )))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                              هیچ محصولی در این دسته‌بندی یافت نشد.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </div>
      
      <AddProductDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editableItem={editingItem}
        onProductAdded={() => {
          fetchItems();
          setEditingItem(null); 
        }} 
      />
    </>
  );
}
