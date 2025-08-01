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

const colorOptions = [ { name: 'Slate', class: 'bg-slate-700' }, { name: 'Gray', class: 'bg-gray-700' }, { name: 'Zinc', class: 'bg-zinc-700' }, { name: 'Stone', class: 'bg-stone-700' }, { name: 'Red', class: 'bg-red-700' }, { name: 'Rose', class: 'bg-rose-700' }, { name: 'Orange', class: 'bg-orange-700' }, { name: 'Amber', class: 'bg-amber-700' }, { name: 'Yellow', class: 'bg-yellow-600' }, { name: 'Lime', class: 'bg-lime-600' }, { name: 'Green', class: 'bg-green-700' }, { name: 'Emerald', class: 'bg-emerald-700' }, { name: 'Teal', class: 'bg-teal-700' }, { name: 'Cyan', class: 'bg-cyan-700' }, { name: 'Sky', class: 'bg-sky-700' }, { name: 'Blue', class: 'bg-blue-700' }, { name: 'Indigo', class: 'bg-indigo-700' }, { name: 'Violet', class: 'bg-violet-700' }, { name: 'Purple', class: 'bg-purple-700' }, { name: 'Fuchsia', class: 'bg-fuchsia-700' }, { name: 'Pink', class: 'bg-pink-700' }];

const SortableCategoryRow = ({ 
  category, 
  onEdit, 
  onDelete, 
  onToggle 
}: { 
  category: Category, 
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
          <span className={cn(!category.isActive && "text-gray-400 line-through")}>
            {category.name}
          </span>
          {!category.isActive && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              غیرفعال
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full border ${category.brandColor || 'bg-gray-200'}`} />
          <span>{category.brandColor?.replace('bg-', '').replace('-700', '')}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {category._count?.products || 0} محصول
          </span>
        </div>
      </TableCell>
      <TableCell>{new Date(category.updatedAt).toLocaleDateString('fa-IR')}</TableCell>
      <TableCell className="text-right">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={category.isActive ? "default" : "outline"}
            onClick={() => onToggle(category.id)}
            className={cn(
              "transition-all duration-200",
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
  const [categories, setCategories] = useState<Category[]>([]);
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

  if (isLoading) return <div className="p-8 text-center">در حال بارگذاری...</div>;

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-extrabold md:text-2xl text-gray-900">مدیریت دسته‌بندی‌ها</h1>
        <Button onClick={handleAddNewClick}>افزودن دسته‌بندی</Button>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>لیست دسته‌بندی‌ها</CardTitle>
          <CardDescription>
            دسته‌بندی‌ها را با drag and drop مرتب کنید و وضعیت فعال/غیرفعال آنها را مدیریت کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>نام دسته‌بندی</TableHead>
                  <TableHead>رنگ</TableHead>
                  <TableHead>تعداد محصولات</TableHead>
                  <TableHead>آخرین بروزرسانی</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">نام دسته‌بندی</Label>
              <Input
                id="name"
                name="name"
                defaultValue={editingCategory?.name || ''}
                placeholder="نام دسته‌بندی را وارد کنید"
                required
              />
            </div>
            <div>
              <Label>رنگ دسته‌بندی</Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all",
                      color.class,
                      selectedColor === color.class
                        ? "border-black scale-110"
                        : "border-gray-300 hover:scale-105"
                    )}
                    onClick={() => setSelectedColor(color.class)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">لغو</Button>
              </DialogClose>
              <Button type="submit">
                {editingCategory ? 'ویرایش' : 'افزودن'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}