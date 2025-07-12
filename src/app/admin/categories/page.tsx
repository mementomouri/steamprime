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
import { MoreHorizontal, GripVertical, CheckCircle2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Category } from "@prisma/client";
import { cn } from "@/lib/utils";

const colorOptions = [ { name: 'Slate', class: 'bg-slate-700' }, { name: 'Gray', class: 'bg-gray-700' }, { name: 'Zinc', class: 'bg-zinc-700' }, { name: 'Stone', class: 'bg-stone-700' }, { name: 'Red', class: 'bg-red-700' }, { name: 'Rose', class: 'bg-rose-700' }, { name: 'Orange', class: 'bg-orange-700' }, { name: 'Amber', class: 'bg-amber-700' }, { name: 'Yellow', class: 'bg-yellow-600' }, { name: 'Lime', class: 'bg-lime-600' }, { name: 'Green', class: 'bg-green-700' }, { name: 'Emerald', class: 'bg-emerald-700' }, { name: 'Teal', class: 'bg-teal-700' }, { name: 'Cyan', class: 'bg-cyan-700' }, { name: 'Sky', class: 'bg-sky-700' }, { name: 'Blue', class: 'bg-blue-700' }, { name: 'Indigo', class: 'bg-indigo-700' }, { name: 'Violet', class: 'bg-violet-700' }, { name: 'Purple', class: 'bg-purple-700' }, { name: 'Fuchsia', class: 'bg-fuchsia-700' }, { name: 'Pink', class: 'bg-pink-700' }];

const SortableCategoryRow = ({ category, onEdit, onDelete }: { category: Category, onEdit: (cat: Category) => void, onDelete: (id: number) => void }) => {
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
      <TableCell className="font-bold">{category.name}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full border ${category.brandColor || 'bg-gray-200'}`} />
          <span>{category.brandColor?.replace('bg-', '').replace('-700', '')}</span>
        </div>
      </TableCell>
      <TableCell>{new Date(category.updatedAt).toLocaleDateString('fa-IR')}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(category)}>ویرایش</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(category.id)} className="text-red-500 hover:!text-red-500">حذف</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
    if (window.confirm('آیا از حذف این دسته‌بندی و تمام محصولات مرتبط با آن مطمئن هستید؟')) {
      await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      fetchCategories();
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    if (!selectedColor) {
      alert('لطفاً یک رنگ انتخاب کنید.');
      return;
    }
    const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : '/api/admin/categories';
    const method = editingCategory ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, brandColor: selectedColor }),
    });
    setIsDialogOpen(false);
    setEditingCategory(null);
    fetchCategories();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-extrabold md:text-2xl text-gray-900">
          مدیریت دسته‌بندی‌ها
        </h1>
        <Button onClick={handleAddNewClick}>افزودن دسته‌بندی</Button>
      </div>
      {/* ===== DndContext به اینجا منتقل شد تا کل کارت را در بر بگیرد ===== */}
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <Card>
          <CardHeader>
            <CardTitle>لیست دسته‌بندی‌ها</CardTitle>
            <CardDescription>ترتیب نمایش را با کشیدن و رها کردن سطرها تغییر دهید.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"><span className="sr-only">جابجایی</span></TableHead>
                  <TableHead>نام</TableHead>
                  <TableHead>رنگ هدر</TableHead>
                  <TableHead>آخرین بروزرسانی</TableHead>
                  <TableHead><span className="sr-only">عملیات</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* ===== SortableContext به اینجا منتقل شد تا فقط سطرها را در بر بگیرد ===== */}
                <SortableContext 
                  items={categories.map(c => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {isLoading ? (
                    <TableRow><TableCell colSpan={5} className="text-center h-24">در حال بارگذاری...</TableCell></TableRow>
                  ) : (
                    categories.map((cat) => (
                      <SortableCategoryRow 
                        key={cat.id} 
                        category={cat} 
                        onEdit={handleEditClick}
                        onDelete={handleDelete}
                      />
                    ))
                  )}
                </SortableContext>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </DndContext>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {/* ... محتوای دیالوگ بدون تغییر ... */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit}>
              <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">نام</Label>
                      <Input id="name" name="name" defaultValue={editingCategory?.name || ''} className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4 pt-2">
                      <Label className="text-right pt-2">رنگ</Label>
                      <div className="col-span-3 grid grid-cols-5 gap-2">
                          {colorOptions.map(color => (
                              <div key={color.class} onClick={() => setSelectedColor(color.class)} className="cursor-pointer flex flex-col items-center gap-1">
                                  <div className={cn("h-8 w-8 rounded-full border-2 flex items-center justify-center", color.class, selectedColor === color.class && "border-blue-500 ring-2 ring-blue-500")}>
                                      {selectedColor === color.class && <CheckCircle2 className="h-5 w-5 text-white" />}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
              <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="secondary">انصراف</Button></DialogClose>
                  <Button type="submit">ذخیره</Button>
              </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}