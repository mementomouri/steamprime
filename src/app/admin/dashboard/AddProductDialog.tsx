"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category, Product, Price } from "@prisma/client";

// Define a type for the item being edited
export type EditableItem = {
  product: Product;
  price: Price;
}

interface AddProductDialogProps {
  onProductAdded: () => void;
  // Props for edit mode
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editableItem: EditableItem | null;
}

export function AddProductDialog({ onProductAdded, open, onOpenChange, editableItem }: AddProductDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [isComboboxOpen, setIsComboboxOpen] = useState(false);

  const isEditMode = editableItem !== null;

  useEffect(() => {
    // Fetch categories when the dialog is opened
    if (open) {
      fetch('/api/admin/categories')
        .then(res => res.json())
        .then(data => setCategories(data));
    }

    // If in edit mode, populate the form
    if (open && isEditMode && categories.length > 0) {
      const category = categories.find(cat => cat.id === editableItem.product.categoryId);
      setSelectedCategoryName(category?.name || "");
    }

  }, [open, isEditMode, editableItem, categories.length]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    let response;
    try {
      if (isEditMode) {
        // --- منطق ویرایش ---
        const selectedCategoryObject = categories.find(cat => cat.name === selectedCategoryName);
        const submitData = {
          ...data,
          productId: editableItem.product.id,
          categoryId: selectedCategoryObject?.id,
        };
        response = await fetch(`/api/admin/prices/${editableItem.price.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData),
        });

      } else {
        // --- منطق افزودن ---
        const selectedCategoryObject = categories.find(cat => cat.name === selectedCategoryName);
        if (!selectedCategoryObject) {
            setError("لطفاً یک دسته‌بندی را انتخاب کنید.");
            setIsSubmitting(false);
            return;
        }
        const submitData = { ...data, categoryId: selectedCategoryObject.id };
        response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData),
        });
      }

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || `Failed to ${isEditMode ? 'update' : 'add'} product`);
      }
      
      onOpenChange(false); // بستن دیالوگ
      onProductAdded(); // رفرش کردن جدول

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'ویرایش محصول و قیمت' : 'افزودن محصول و قیمت'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'اطلاعات محصول را ویرایش کنید.' : 'ابتدا دسته‌بندی را انتخاب و سپس اطلاعات محصول را وارد کنید.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} id="product-form">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">دسته‌بندی</Label>
              {/* Category selection is disabled in edit mode to prevent changing category */}
              <Popover open={isComboboxOpen} onOpenChange={setIsComboboxOpen}>
                 <PopoverTrigger asChild>
                   <Button variant="outline" role="combobox" disabled={isEditMode} className="col-span-3 justify-between">
                     {selectedCategoryName || "انتخاب دسته‌بندی..."}
                     <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                   </Button>
                 </PopoverTrigger>
                 <PopoverContent className="w-[300px] p-0">
                   <Command>
                     <CommandInput placeholder="جستجوی دسته‌بندی..." />
                     <CommandList>
                       <CommandGroup>
                         {categories.map((cat) => (
                           <CommandItem key={cat.id} value={cat.name} onSelect={(currentValue) => {
                             setSelectedCategoryName(currentValue);
                             setIsComboboxOpen(false);
                           }}>
                             <Check className={cn("mr-2 h-4 w-4", selectedCategoryName === cat.name ? "opacity-100" : "opacity-0")} />
                             {cat.name}
                           </CommandItem>
                         ))}
                       </CommandGroup>
                     </CommandList>
                   </Command>
                 </PopoverContent>
               </Popover>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">نام محصول</Label>
              <Input id="name" name="name" defaultValue={isEditMode ? editableItem.product.name : ""} required className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">توضیحات</Label>
              <Input id="description" name="description" defaultValue={isEditMode ? editableItem.product.description || '' : ""} placeholder="اختیاری" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">قیمت (تومان)</Label>
              <Input id="amount" name="amount" type="number" defaultValue={isEditMode ? editableItem.price.amount.toString() : ""} required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">رنگ</Label>
              <Input id="color" name="color" defaultValue={isEditMode ? editableItem.price.color || '' : ""} placeholder="اختیاری" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="storage" className="text-right">حافظه</Label>
              <Input id="storage" name="storage" defaultValue={isEditMode ? editableItem.price.storage || '' : ""} placeholder="اختیاری" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="warranty" className="text-right">گارانتی</Label>
              <Input id="warranty" name="warranty" defaultValue={isEditMode ? editableItem.price.warranty || '' : ""} placeholder="اختیاری" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="label" className="text-right">برچسب قیمت</Label>
              <Input id="label" name="label" defaultValue={isEditMode ? editableItem.price.label || '' : ""} placeholder="مثلا: اصلی، شرکتی" className="col-span-3" />
            </div>
          </div>
        </form>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <DialogFooter>
          <Button type="submit" form="product-form" disabled={isSubmitting}>
            {isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}