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
import { Input } from "@/components/ui/input";
import { MoreHorizontal, GripVertical, Save, RotateCcw, AlertCircle, Edit, Check, X } from "lucide-react";
import { AddProductDialog, type EditableItem } from "./AddProductDialog";
import type { Category, Product, Price } from "@prisma/client";

// گسترش تایپ‌ها برای پشتیبانی از فیلدهای جدید
type PriceWithDetails = Price & { 
  dimensions?: string | null;
  discount?: number | null;
};
type ProductWithPrices = Product & { prices: PriceWithDetails[] };
type CategoryWithProducts = Category & { products: ProductWithPrices[] };

// کامپوننت ویرایش مستقیم قیمت
const EditablePriceCell = ({ 
  price, 
  onSave, 
  onCancel 
}: { 
  price: PriceWithDetails, 
  onSave: (newAmount: number) => void, 
  onCancel: () => void 
}) => {
  const [editingAmount, setEditingAmount] = useState(String(price.amount));
  const [isEditing, setIsEditing] = useState(false);

  // به‌روزرسانی editingAmount وقتی price تغییر می‌کند
  useEffect(() => {
    setEditingAmount(String(price.amount));
  }, [price.amount]);

  const handleSave = useCallback(() => {
    const newAmount = Number(editingAmount);
    if (isNaN(newAmount) || newAmount <= 0) {
      toast.error('لطفاً یک قیمت معتبر وارد کنید');
      return;
    }
    onSave(newAmount);
    setIsEditing(false);
  }, [editingAmount, onSave]);

  const handleCancel = useCallback(() => {
    setEditingAmount(String(price.amount));
    setIsEditing(false);
    onCancel();
  }, [price.amount, onCancel]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <Input
          value={editingAmount}
          onChange={(e) => setEditingAmount(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-24 h-8 text-sm"
          autoFocus
          type="number"
          min="0"
        />
        <Button size="sm" onClick={handleSave} className="h-8 w-8 p-0">
          <Check className="h-3 w-3" />
        </Button>
        <Button size="sm" onClick={handleCancel} variant="outline" className="h-8 w-8 p-0">
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <span 
        className="font-bold text-right cursor-pointer hover:text-blue-600 transition-colors" 
        onClick={startEditing}
        title="برای ویرایش کلیک کنید"
      >
        {new Intl.NumberFormat('fa-IR').format(Number(price.amount))}
      </span>
      <Button 
        size="sm" 
        onClick={startEditing} 
        variant="ghost" 
        className="h-6 w-6 p-0 hover:bg-blue-50"
        title="ویرایش قیمت"
      >
        <Edit className="h-3 w-3" />
      </Button>
    </div>
  );
};

// کامپوننت ویرایش مستقیم تخفیف
const EditableDiscountCell = ({ 
  price, 
  onSave, 
  onCancel 
}: { 
  price: PriceWithDetails, 
  onSave: (newDiscount: number) => void, 
  onCancel: () => void 
}) => {
  const [editingDiscount, setEditingDiscount] = useState(String(price.discount || ''));
  const [isEditing, setIsEditing] = useState(false);

  // به‌روزرسانی editingDiscount وقتی price تغییر می‌کند
  useEffect(() => {
    setEditingDiscount(String(price.discount || ''));
  }, [price.discount]);

  const handleSave = useCallback(() => {
    const newDiscount = Number(editingDiscount);
    if (isNaN(newDiscount) || newDiscount < 0 || newDiscount > 100) {
      toast.error('لطفاً درصد تخفیف معتبری وارد کنید (0-100)');
      return;
    }
    onSave(newDiscount);
    setIsEditing(false);
  }, [editingDiscount, onSave]);

  const handleCancel = useCallback(() => {
    setEditingDiscount(String(price.discount || ''));
    setIsEditing(false);
    onCancel();
  }, [price.discount, onCancel]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <Input
          value={editingDiscount}
          onChange={(e) => setEditingDiscount(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-20 h-8 text-sm"
          autoFocus
          type="number"
          min="0"
          max="100"
          step="0.1"
          placeholder="0"
        />
        <Button size="sm" onClick={handleSave} className="h-8 w-8 p-0">
          <Check className="h-3 w-3" />
        </Button>
        <Button size="sm" onClick={handleCancel} variant="outline" className="h-8 w-8 p-0">
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <span 
        className="text-right cursor-pointer hover:text-green-600 transition-colors" 
        onClick={startEditing}
        title="برای ویرایش تخفیف کلیک کنید"
      >
        {price.discount ? (
          <span className="text-green-600 font-medium">{price.discount}%</span>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </span>
      <Button 
        size="sm" 
        onClick={startEditing} 
        variant="ghost" 
        className="h-6 w-6 p-0 hover:bg-green-50"
        title="ویرایش تخفیف"
      >
        <Edit className="h-3 w-3" />
      </Button>
    </div>
  );
};

// کامپوننت بهینه شده برای نمایش محصول
const SortableProductRow = ({ 
  product, 
  onEdit, 
  onDelete,
  onDeleteProduct,
  onPriceChange,
  onDiscountChange
}: { 
  product: ProductWithPrices, 
  onEdit: (product: Product, price: PriceWithDetails | null) => void, 
  onDelete: (priceId: number) => void,
  onDeleteProduct: (productId: number) => void,
  onPriceChange: (priceId: number, newAmount: number) => void,
  onDiscountChange: (priceId: number, newDiscount: number) => void
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

  const handlePriceSave = useCallback((newAmount: number) => {
    if (mainPrice) {
      onPriceChange(mainPrice.id, newAmount);
    }
  }, [mainPrice, onPriceChange]);

  const handleDiscountSave = useCallback((newDiscount: number) => {
    if (mainPrice) {
      onDiscountChange(mainPrice.id, newDiscount);
    }
  }, [mainPrice, onDiscountChange]);

  // محاسبه قیمت با تخفیف
  const discountedPrice = useMemo(() => {
    if (!mainPrice || !mainPrice.discount) return null;
    const originalPrice = Number(mainPrice.amount);
    const discountAmount = originalPrice * (mainPrice.discount / 100);
    return Math.round(originalPrice - discountAmount);
  }, [mainPrice]);

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes} data-state={isDragging ? "dragging" : undefined} className="odd:bg-[#FFFFFF] even:bg-[#E8F3FF] hover:bg-[#DBEAFE]">
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
        {mainPrice ? (
          <EditableDiscountCell
            price={mainPrice}
            onSave={handleDiscountSave}
            onCancel={() => {}}
          />
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </TableCell>
      <TableCell className="text-sm text-right">
        {mainPrice?.storage || <span className="text-gray-400">-</span>}
      </TableCell>
      <TableCell className="text-sm font-bold text-right text-[#1E293B]">
        {mainPrice ? (
          <div className="flex flex-col gap-1">
            <EditablePriceCell
              price={mainPrice}
              onSave={handlePriceSave}
              onCancel={() => {}}
            />
            {discountedPrice && mainPrice.discount && (
              <div className="text-xs text-green-600">
                <span className="line-through text-gray-500">
                  {new Intl.NumberFormat('fa-IR').format(Number(mainPrice.amount))}
                </span>
                <br />
                <span className="font-bold">
                  {new Intl.NumberFormat('fa-IR').format(discountedPrice)}
                </span>
                <span className="text-green-600"> (با تخفیف)</span>
              </div>
            )}
          </div>
        ) : (
          <span className="text-gray-400">---</span>
        )}
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
              ویرایش کامل
            </DropdownMenuItem>
            {mainPrice && (
              <DropdownMenuItem 
                onClick={() => onDelete(mainPrice.id)} 
                className="text-red-600"
              >
                حذف قیمت
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={() => onDeleteProduct(product.id)} 
              className="text-red-700 font-bold"
            >
              حذف کامل محصول
            </DropdownMenuItem>
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
  const [pendingPriceChanges, setPendingPriceChanges] = useState<Map<number, number>>(new Map());
  const [pendingDiscountChanges, setPendingDiscountChanges] = useState<Map<number, number>>(new Map());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
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
      setPendingPriceChanges(new Map());
      setPendingDiscountChanges(new Map());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "خطا در بارگذاری اطلاعات";
      setError(errorMessage);
      
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

  const handleDragEnd = useCallback((event: DragEndEvent) => {
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
  }, [allProducts, categories]);

  const handlePriceChange = useCallback((priceId: number, newAmount: number) => {
    setPendingPriceChanges(prev => new Map(prev).set(priceId, newAmount));
    setHasChanges(true);
    
    // به‌روزرسانی موقت UI - فقط برای نمایش
    setCategories(prevCategories => 
      prevCategories.map(category => ({
        ...category,
        products: category.products.map(product => ({
          ...product,
          prices: product.prices.map(price => 
            price.id === priceId ? { ...price, amount: newAmount as any } : price // eslint-disable-line @typescript-eslint/no-explicit-any
          )
        }))
      }))
    );
  }, []);

  const handleDiscountChange = useCallback((priceId: number, newDiscount: number) => {
    setPendingDiscountChanges(prev => new Map(prev).set(priceId, newDiscount));
    setHasChanges(true);
    
    // به‌روزرسانی موقت UI - فقط برای نمایش
    setCategories(prevCategories => 
      prevCategories.map(category => ({
        ...category,
        products: category.products.map(product => ({
          ...product,
          prices: product.prices.map(price => 
            price.id === priceId ? { ...price, discount: newDiscount as any } : price // eslint-disable-line @typescript-eslint/no-explicit-any
          )
        }))
      }))
    );
  }, []);

  const handleSaveChanges = useCallback(async () => {
    if (!hasChanges) return;

    const promise = new Promise<void>(async (resolve, reject) => {
      try {
        setIsSaving(true);
        
        const orderedIds = allProducts.map(product => product.id);
        
        if (orderedIds.length === 0) {
          throw new Error('هیچ محصولی برای ذخیره وجود ندارد');
        }
        
        if (orderedIds.some(id => !id || id <= 0)) {
          throw new Error('شناسه‌های محصول نامعتبر هستند');
        }

        // ذخیره تغییرات قیمت‌ها
        const priceUpdatePromises = Array.from(pendingPriceChanges.entries()).map(([priceId, newAmount]) =>
          fetch(`/api/admin/prices/${priceId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: newAmount }),
          }).then(response => {
            if (!response.ok) {
              throw new Error(`خطا در به‌روزرسانی قیمت ${priceId}`);
            }
            return response;
          })
        );

        // اجرای همزمان به‌روزرسانی قیمت‌ها
        if (priceUpdatePromises.length > 0) {
          await Promise.all(priceUpdatePromises);
        }
        
        // ذخیره تغییرات تخفیف‌ها
        const discountUpdatePromises = Array.from(pendingDiscountChanges.entries()).map(([priceId, newDiscount]) =>
          fetch(`/api/admin/prices/${priceId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ discount: newDiscount }),
          }).then(response => {
            if (!response.ok) {
              throw new Error(`خطا در به‌روزرسانی تخفیف ${priceId}`);
            }
            return response;
          })
        );

        if (discountUpdatePromises.length > 0) {
          await Promise.all(discountUpdatePromises);
        }

        // ذخیره تغییرات ترتیب محصولات
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
        setPendingPriceChanges(new Map());
        setPendingDiscountChanges(new Map());
        
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
  }, [hasChanges, allProducts, pendingPriceChanges, pendingDiscountChanges, categories]);

  const handleResetChanges = useCallback(() => {
    setCategories(originalCategories);
    setHasChanges(false);
    setPendingPriceChanges(new Map());
    setPendingDiscountChanges(new Map());
    toast.success('تغییرات لغو شد');
  }, [originalCategories]);

  const handleDeletePrice = useCallback(async (priceId: number) => {
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
  }, [fetchItems]);

  const handleDeleteProduct = useCallback(async (productId: number) => {
    if (!productId || productId <= 0) {
      toast.error('شناسه محصول نامعتبر است');
      return;
    }

    const promise = new Promise<void>(async (resolve, reject) => {
      if (window.confirm('آیا از حذف کامل این محصول مطمئن هستید؟ این عملیات غیرقابل بازگشت است و تمام قیمت‌های مربوط به آن نیز حذف خواهد شد.')) {
        try {
          const response = await fetch(`/api/admin/products?productId=${productId}`, { 
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            reject(new Error(errorData.details || 'خطا در حذف محصول'));
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
      loading: 'در حال حذف محصول...',
      success: 'محصول با موفقیت حذف شد!',
      error: (err) => err.message === "Operation cancelled" ? "عملیات لغو شد." : err.message,
    });
  }, [fetchItems]);
  
  const handleEditClick = useCallback((product: Product, price: PriceWithDetails | null) => {
    if (price) {
      setEditingItem({ product, price });
    } else {
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
          dimensions: null,
          discount: null
        } 
      });
    }
    setIsDialogOpen(true);
  }, []);

  const handleAddNewClick = useCallback(() => {
    setEditingItem(null);
    setIsDialogOpen(true);
  }, []);

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
        <h1 className="text-lg font-extrabold md:text-2xl text-foreground">مدیریت محصولات</h1>
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
                          <TableHead className="text-right">تخفیف</TableHead>
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
                                onDeleteProduct={handleDeleteProduct}
                                onPriceChange={handlePriceChange}
                                onDiscountChange={handleDiscountChange}
                              />
                            ))}
                          </SortableContext>
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center text-gray-500">
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
        onProductAdded={(productData) => {
          if (productData) {
            const { product, isEdit } = productData;
            if (isEdit && editingItem) {
              // برای ویرایش، محصول موجود را به‌روزرسانی می‌کنیم
              setCategories(prevCategories => 
                prevCategories.map(category => ({
                  ...category,
                  products: category.products.map(p => 
                    p.id === editingItem.product.id 
                      ? { ...p, ...product }
                      : p
                  )
                }))
              );
            } else {
              // برای محصول جدید، آن را به دسته‌بندی مربوطه اضافه می‌کنیم
              setCategories(prevCategories => 
                prevCategories.map(category => 
                  category.id === product.categoryId
                    ? {
                        ...category,
                        products: [...category.products, product]
                      }
                    : category
                )
              );
            }
          }
          setEditingItem(null);
          setIsDialogOpen(false);
        }} 
      />
    </>
  );
}
