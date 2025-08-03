"use client"; 

import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  DndContext, 
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import toast from 'react-hot-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, GripVertical, Save, RotateCcw, AlertCircle } from "lucide-react";
import { AddProductDialog, type EditableItem } from "./AddProductDialog";
import type { Category, Product, Price } from "@prisma/client";

// گسترش تایپ‌ها برای پشتیبانی از فیلدهای جدید
type PriceWithDetails = Price & { dimensions?: string | null };
type ProductWithPrices = Product & { prices: PriceWithDetails[] };
type CategoryWithProducts = Category & { products: ProductWithPrices[] };



// کامپوننت بهینه شده برای نمایش محصول
const SortableProductRow = ({ 
  product, 
  onEdit, 
  onDelete 
}: { 
  product: ProductWithPrices, 
  onEdit: (product: Product, price: PriceWithDetails | null) => void, 
  onDelete: (priceId: number) => void 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

     // بهینه‌سازی: محاسبه قیمت اصلی فقط یک بار
   const mainPrice = useMemo(() => 
     product.prices[0] || null, 
     [product.prices]
   );

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes} data-state={isDragging ? "dragging" : undefined}>
      <TableCell className="w-12">
        <div {...listeners} className="p-2 cursor-grab active:cursor-grabbing hover:bg-gray-50 rounded">
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
      </TableCell>
             <TableCell className="font-medium text-right">{product.name}</TableCell>
       <TableCell className="text-sm text-right">
         {mainPrice?.color || <span className="text-gray-400">-</span>}
       </TableCell>
       <TableCell className="text-sm text-right">
         {mainPrice?.storage || <span className="text-gray-400">-</span>}
       </TableCell>
       <TableCell className="text-sm font-bold text-right">
         {mainPrice?.amount ? 
           new Intl.NumberFormat('fa-IR').format(Number(mainPrice.amount)) : 
           <span className="text-gray-400">---</span>
         }
       </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
             <DropdownMenuLabel>عملیات</DropdownMenuLabel>
             <DropdownMenuItem onClick={() => onEdit(product, mainPrice)}>
               ویرایش
             </DropdownMenuItem>
             {mainPrice && (
               <DropdownMenuItem 
                 onClick={() => onDelete(mainPrice.id)} 
                 className="text-red-600"
               >
                 حذف
               </DropdownMenuItem>
             )}
           </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default function DashboardPage() {
  const [categories, setCategories] = useState<CategoryWithProducts[]>([]);
  const [originalCategories, setOriginalCategories] = useState<CategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EditableItem | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // افزایش فاصله برای جلوگیری از drag تصادفی
      },
    })
  );

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/products', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setCategories(data);
      setOriginalCategories(data);
      setHasChanges(false);
      setRetryCount(0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "خطا در بارگذاری اطلاعات";
      setError(errorMessage);
      
      // تلاش مجدد در صورت خطا
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // بهینه‌سازی: محاسبه تمام محصولات فقط یک بار
  const allProducts = useMemo(() => 
    categories.flatMap(category => category.products), 
    [categories]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      try {
        const oldIndex = allProducts.findIndex((product) => product.id === active.id);
        const newIndex = allProducts.findIndex((product) => product.id === over.id);
        
        if (oldIndex === -1 || newIndex === -1) {
          toast.error('خطا در پیدا کردن محصول');
          return;
        }
        
        const newOrder = arrayMove(allProducts, oldIndex, newIndex);

        // بازسازی categories از ترتیب جدید
        const newCategories = categories.map(category => ({
          ...category,
          products: newOrder.filter(product => product.categoryId === category.id)
        }));

        setCategories(newCategories);
        setHasChanges(true);
      } catch (error) {
        console.error('Error in drag end:', error);
        toast.error('خطا در تغییر ترتیب محصولات');
      }
    }
  };

  const handleSaveChanges = async () => {
    if (!hasChanges) return;

    const promise = new Promise<void>(async (resolve, reject) => {
      try {
        setIsSaving(true);
        
        const orderedIds = allProducts.map(product => product.id);
        
        // اعتبارسنجی داده‌ها قبل از ارسال
        if (orderedIds.length === 0) {
          throw new Error('هیچ محصولی برای ذخیره وجود ندارد');
        }
        
        if (orderedIds.some(id => !id || id <= 0)) {
          throw new Error('شناسه‌های محصول نامعتبر هستند');
        }
        
        const response = await fetch('/api/admin/products/reorder', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderedIds }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `خطای سرور: ${response.status}`);
        }

        const result = await response.json();
        setOriginalCategories(categories);
        setHasChanges(false);
        
        toast.success(`تغییرات با موفقیت ذخیره شد! (${result.updatedCount} محصول)`);
        resolve();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'خطا در ذخیره تغییرات';
        reject(new Error(errorMessage));
      } finally {
        setIsSaving(false);
      }
    });

    toast.promise(promise, {
      loading: 'در حال ذخیره تغییرات...',
      success: 'تغییرات با موفقیت ذخیره شد!',
      error: (err) => err.message,
    });
  };

  const handleResetChanges = () => {
    setCategories(originalCategories);
    setHasChanges(false);
    toast.success('تغییرات لغو شد');
  };

  const handleDeletePrice = async (priceId: number) => {
    if (!priceId || priceId <= 0) {
      toast.error('شناسه قیمت نامعتبر است');
      return;
    }

    const promise = new Promise<void>(async (resolve, reject) => {
      if (window.confirm('آیا از حذف این ردیف قیمت مطمئن هستید؟')) {
        try {
          const response = await fetch(`/api/admin/prices/${priceId}`, { 
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
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
      error: (err) => err.message === "Operation cancelled" ? "عملیات لغو شد." : err.message,
    });
  };
  
  const handleEditClick = (product: Product, price: PriceWithDetails | null) => {
    if (price) {
      setEditingItem({ product, price });
    } else {
      // اگر قیمت وجود ندارد، یک قیمت dummy ایجاد می‌کنیم
             setEditingItem({ 
         product, 
         price: { 
           id: 0, 
           amount: 0 as unknown as Price['amount'], 
           createdAt: new Date(), 
           productId: product.id, 
           color: null, 
           storage: null, 
           warranty: null, 
           label: null, 
           dimensions: null 
         } 
       });
    }
    setIsDialogOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  // نمایش خطا
  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="flex items-center justify-center gap-2 text-red-500 mb-4">
          <AlertCircle className="h-6 w-6" />
          <span className="text-lg font-semibold">خطا در بارگذاری اطلاعات</span>
        </div>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={fetchItems} disabled={loading}>
          تلاش مجدد
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>در حال بارگذاری اطلاعات...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-extrabold md:text-2xl text-gray-900">مدیریت محصولات</h1>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <>
              <Button 
                onClick={handleResetChanges}
                variant="outline" 
                size="sm"
                className="text-orange-600 hover:text-orange-700"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                لغو تغییرات
              </Button>
              <Button 
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="h-4 w-4 mr-1" />
                {isSaving ? 'در حال ذخیره...' : 'ثبت تغییرات'}
              </Button>
            </>
          )}
          <Button onClick={handleAddNewClick} className="font-bold">افزودن آیتم جدید</Button>
        </div>
      </div>

      {hasChanges && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-blue-800 font-medium">
              تغییرات ذخیره نشده وجود دارد. برای اعمال تغییرات روی &quot;ثبت تغییرات&quot; کلیک کنید.
            </span>
          </div>
        </div>
      )}

      <div className="mt-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <Accordion type="single" collapsible className="w-full">
            {categories.map((category) => (
              <AccordionItem value={category.id.toString()} key={category.id}>
                <AccordionTrigger className="text-xl font-bold bg-gray-100 px-4 rounded-md border">
                  {category.name} ({category.products.length} محصول)
                </AccordionTrigger>
                <AccordionContent className="p-2">
                  <div className="rounded-lg border shadow-sm">
                    <Table>
                                             <TableHeader>
                         <TableRow>
                           <TableHead className="w-12"></TableHead>
                           <TableHead className="text-right">نام محصول</TableHead>
                           <TableHead className="text-right">رنگ</TableHead>
                           <TableHead className="text-right">حافظه</TableHead>
                           <TableHead className="text-right">قیمت (تومان)</TableHead>
                           <TableHead><span className="sr-only">عملیات</span></TableHead>
                         </TableRow>
                       </TableHeader>
                      <TableBody>
                        {category.products.length > 0 ? (
                          <SortableContext 
                            items={category.products.map(product => product.id)} 
                            strategy={verticalListSortingStrategy}
                          >
                            {category.products.map(product => (
                              <SortableProductRow
                                key={product.id}
                                product={product}
                                onEdit={handleEditClick}
                                onDelete={handleDeletePrice}
                              />
                            ))}
                          </SortableContext>
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-gray-500">
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
        </DndContext>
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
