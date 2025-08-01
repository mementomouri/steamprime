"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MoreHorizontal, GripVertical, Eye, EyeOff } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Category } from "@prisma/client";
import { cn } from "@/lib/utils";
import toast from 'react-hot-toast';

// تعریف نوع جدید برای Category با فیلد _count
type CategoryWithCount = Category & {
  _count?: {
    products: number;
  };
  isActive: boolean;
};

const colorOptions = [ 
  { name: 'White', class: 'bg-white' },
  { name: 'Light Gray', class: 'bg-gray-400' },
  { name: 'Samsung Blue', class: 'bg-blue-900' },
  { name: 'Huawei Red', class: 'bg-red-600' },
  { name: 'Realme Yellow', class: 'bg-yellow-500' },
  { name: 'Motorola Blue', class: 'bg-blue-600' },
  { name: 'Google Blue', class: 'bg-blue-500' },
  { name: 'Nothing Black', class: 'bg-black' },
  { name: 'Xiaomi Orange', class: 'bg-orange-500' },
  { name: 'OnePlus Red', class: 'bg-red-700' },
  { name: 'TabXiaomi Green', class: 'bg-green-600' },
  { name: 'Slate', class: 'bg-slate-700' }, 
  { name: 'Gray', class: 'bg-gray-700' }, 
  { name: 'Zinc', class: 'bg-zinc-700' }, 
  { name: 'Stone', class: 'bg-stone-700' }, 
  { name: 'Red', class: 'bg-red-700' }, 
  { name: 'Rose', class: 'bg-rose-700' }, 
  { name: 'Orange', class: 'bg-orange-700' }, 
  { name: 'Amber', class: 'bg-amber-700' }, 
  { name: 'Yellow', class: 'bg-yellow-600' }, 
  { name: 'Lime', class: 'bg-lime-600' }, 
  { name: 'Green', class: 'bg-green-700' }, 
  { name: 'Emerald', class: 'bg-emerald-700' }, 
  { name: 'Teal', class: 'bg-teal-700' }, 
  { name: 'Cyan', class: 'bg-cyan-700' }, 
  { name: 'Sky', class: 'bg-sky-700' }, 
  { name: 'Blue', class: 'bg-blue-700' }, 
  { name: 'Indigo', class: 'bg-indigo-700' }, 
  { name: 'Violet', class: 'bg-violet-700' }, 
  { name: 'Purple', class: 'bg-purple-700' }, 
  { name: 'Fuchsia', class: 'bg-fuchsia-700' }, 
  { name: 'Pink', class: 'bg-pink-700' }
];

const SortableCategoryRow = ({ 
  category, 
  onEdit, 
  onDelete, 
  onToggle 
}: { 
  category: CategoryWithCount, 
  onEdit: (cat: Category) => void, 
  onDelete: (id: number) => void,
  onToggle: (id: number) => void
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes} data-state={isDragging ? "dragging" : undefined}>
      <TableCell className="w-12">
        <div {...listeners} className="p-2 cursor-grab active:cursor-grabbing">
           <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
      </TableCell>
      <TableCell className="font-bold">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-lg font-semibold tracking-wide",
            !category.isActive && "text-gray-400 line-through"
          )}>
            {category.name}
          </span>
          {!category.isActive && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
              غیرفعال
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full border ${category.brandColor || 'bg-gray-200'} ${category.brandColor === 'bg-white' ? 'border-gray-300' : ''} ${category.brandColor === 'bg-gray-400' ? 'border-gray-600' : ''} ${category.brandColor === 'bg-blue-900' ? 'border-blue-700' : ''} ${category.brandColor === 'bg-black' ? 'border-gray-600' : ''} ${category.brandColor === 'bg-red-600' ? 'border-red-800' : ''} ${category.brandColor === 'bg-yellow-500' ? 'border-yellow-700' : ''} ${category.brandColor === 'bg-blue-600' ? 'border-blue-800' : ''} ${category.brandColor === 'bg-blue-500' ? 'border-blue-700' : ''} ${category.brandColor === 'bg-orange-500' ? 'border-orange-700' : ''} ${category.brandColor === 'bg-red-700' ? 'border-red-900' : ''} ${category.brandColor === 'bg-green-600' ? 'border-green-800' : ''}`} />
          <span className="font-medium text-gray-700">{category.brandColor?.replace('bg-', '').replace('-700', '').replace('-600', '').replace('-500', '').replace('-400', '').replace('-200', '').replace('-900', '').replace('-800', '') || 'بدون رنگ'}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">
            {category._count?.products || 0} محصول
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl px-4 py-2 shadow-sm">
            <div className="text-xs text-blue-600 font-semibold mb-1 tracking-wide">آخرین بروزرسانی</div>
            <div className="text-sm font-bold text-gray-800">
              {new Date(category.updatedAt).toLocaleDateString('fa-IR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={category.isActive ? "default" : "outline"}
            onClick={() => onToggle(category.id)}
            className={cn(
              "transition-all duration-200 font-medium",
              category.isActive 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            )}
          >
            {category.isActive ? (
              <>
                <Eye className="h-4 w-4 mr-1" />
                فعال
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4 mr-1" />
                غیرفعال
              </>
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(category)}>ویرایش</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(category.id)} className="text-red-500 hover:!text-red-500">حذف</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | undefined>('');
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    const response = await fetch('/api/admin/categories');
    const data = await response.json();
    setCategories(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);
      const newOrder = arrayMove(categories, oldIndex, newIndex);
      setCategories(newOrder);
      const orderedIds = newOrder.map(cat => cat.id);
      await fetch('/api/admin/categories/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });
    }
  };

  const handleToggleCategory = async (categoryId: number) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle category');
      }

      const result = await response.json();
      
      // به‌روزرسانی state
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, isActive: !cat.isActive, updatedAt: new Date() }
          : cat
      ));

      toast.success(result.message);
    } catch (error) {
      console.error('Error toggling category:', error);
      toast.error('خطا در تغییر وضعیت دسته‌بندی');
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setSelectedColor(category.brandColor || '');
    setIsDialogOpen(true);
  };
  
  const handleAddNewClick = () => {
    setEditingCategory(null);
    setSelectedColor('');
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('آیا از حذف این دسته‌بندی مطمئن هستید؟')) {
      try {
        const response = await fetch(`/api/admin/categories/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setCategories(categories.filter(cat => cat.id !== id));
          toast.success('دسته‌بندی با موفقیت حذف شد');
        } else {
          toast.error('خطا در حذف دسته‌بندی');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('خطا در حذف دسته‌بندی');
      }
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const brandColor = selectedColor;

    if (!name.trim()) {
      toast.error('نام دسته‌بندی الزامی است');
      return;
    }

    try {
      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), brandColor }),
      });

      if (response.ok) {
        setIsDialogOpen(false);
        fetchCategories();
        toast.success(editingCategory ? 'دسته‌بندی با موفقیت ویرایش شد' : 'دسته‌بندی با موفقیت ایجاد شد');
      } else {
        toast.error('خطا در ذخیره دسته‌بندی');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('خطا در ذخیره دسته‌بندی');
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-600">در حال بارگذاری...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-wide">
            مدیریت دسته‌بندی‌ها
          </h1>
          <p className="text-gray-600 font-medium">
            مدیریت و سازماندهی دسته‌بندی‌های محصولات
          </p>
        </div>
        <Button 
          onClick={handleAddNewClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 text-lg"
        >
          افزودن دسته‌بندی
        </Button>
      </div>

      {/* Main Content */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
          <CardTitle className="text-xl font-bold text-gray-900 tracking-wide">
            لیست دسته‌بندی‌ها
          </CardTitle>
          <CardDescription className="text-gray-600 font-medium leading-relaxed">
            دسته‌بندی‌ها را با drag and drop مرتب کنید و وضعیت فعال/غیرفعال آنها را مدیریت کنید.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="w-12 text-center font-bold text-gray-700"></TableHead>
                  <TableHead className="font-bold text-gray-700 text-lg">نام دسته‌بندی</TableHead>
                  <TableHead className="font-bold text-gray-700 text-lg">رنگ</TableHead>
                  <TableHead className="font-bold text-gray-700 text-lg">تعداد محصولات</TableHead>
                  <TableHead className="font-bold text-gray-700 text-lg">آخرین بروزرسانی</TableHead>
                  <TableHead className="text-right font-bold text-gray-700 text-lg">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SortableContext items={categories.map(c => c.id)} strategy={verticalListSortingStrategy}>
                  {categories.map((category) => (
                    <SortableCategoryRow
                      key={category.id}
                      category={category}
                      onEdit={handleEditClick}
                      onDelete={handleDelete}
                      onToggle={handleToggleCategory}
                    />
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 tracking-wide">
              {editingCategory ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-base font-semibold text-gray-700 mb-2 block">
                نام دسته‌بندی
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={editingCategory?.name || ''}
                placeholder="نام دسته‌بندی را وارد کنید"
                required
                className="text-lg p-3 border-2 focus:border-blue-500"
              />
            </div>
            <div>
              <Label className="text-base font-semibold text-gray-700 mb-3 block">
                رنگ دسته‌بندی
              </Label>
              <div className="grid grid-cols-6 gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    className={cn(
                      "w-10 h-10 rounded-full border-2 transition-all duration-200",
                      color.class,
                      selectedColor === color.class
                        ? "border-gray-800 scale-110 shadow-lg"
                        : "border-gray-500 hover:scale-105 hover:shadow-md"
                    )}
                    onClick={() => setSelectedColor(color.class)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            <DialogFooter className="gap-3">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="font-medium">
                  لغو
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 font-semibold">
                {editingCategory ? 'ویرایش' : 'افزودن'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}