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
import toast from 'react-hot-toast';
// import { Switch } from "@/components/ui/switch"; // <-- Switch حذف شد چون استفاده نمی‌شد

// تایپ Price را گسترش می‌دهیم تا dimensions را به صورت اختیاری بپذیرد
type PriceWithDimensions = Price & { dimensions?: string | null };

export type EditableItem = {
  product: Product;
  price: PriceWithDimensions;
}

interface AddProductDialogProps {
  onProductAdded: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editableItem: EditableItem | null;
}

export function AddProductDialog({ onProductAdded, open, onOpenChange, editableItem }: AddProductDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [isComboboxOpen, setIsComboboxOpen] = useState(false);
  const isEditMode = editableItem !== null;

  useEffect(() => {
    if (open) {
      fetch('/api/admin/categories').then(res => res.json()).then(setCategories);
    }
  }, [open]);

  useEffect(() => {
    if (open && isEditMode && editableItem && categories.length > 0) {
      const category = categories.find(cat => cat.id === editableItem.product.categoryId);
      setSelectedCategoryName(category?.name || "");
    } else if (!open) {
      setSelectedCategoryName("");
    }
  }, [open, isEditMode, editableItem, categories]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const promise = new Promise<void>(async (resolve, reject) => {
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());
        let response;
        try {
            const selectedCategoryObject = categories.find(cat => cat.name === selectedCategoryName);
            if (!selectedCategoryObject) {
                reject(new Error("لطفاً یک دسته‌بندی را انتخاب کنید."));
                return;
            }
            if (isEditMode) {
                const submitData = { ...data, productId: editableItem.product.id, categoryId: selectedCategoryObject.id };
                response = await fetch(`/api/admin/prices/${editableItem.price.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(submitData),
                });
            } else {
                const submitData = { ...data, categoryId: selectedCategoryObject.id };
                response = await fetch('/api/admin/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(submitData),
                });
            }
            if (!response.ok) {
                const errorResult = await response.json();
                reject(new Error(errorResult.message || `Failed to ${isEditMode ? 'update' : 'add'} product`));
                return;
            }
            onOpenChange(false);
            onProductAdded();
            resolve();
        } catch (err) {
            reject(err as Error);
        } finally {
            setIsSubmitting(false);
        }
    });
    toast.promise(promise, {
        loading: 'در حال ذخیره...',
        success: `آیتم با موفقیت ${isEditMode ? 'ویرایش' : 'افزوده'} شد!`,
        error: (err) => err.message,
    });
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
                                    <CommandEmpty>دسته‌بندی یافت نشد.</CommandEmpty>
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
                        <Input id="amount" name="amount" type="number" defaultValue={isEditMode ? String(editableItem.price.amount) : ""} required className="col-span-3" />
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
                    {selectedCategoryName.trim().toUpperCase() === "ACCESSORIES APPLE" && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dimensions" className="text-right">ابعاد</Label>
                            {/* استفاده از تایپ صحیح به جای as any */}
                            <Input id="dimensions" name="dimensions" defaultValue={isEditMode ? editableItem.price.dimensions || '' : ""} placeholder="مثال: 15x7 سانتی‌متر" className="col-span-3" />
                        </div>
                    )}
                </div>
            </form>
            <DialogFooter>
                <Button type="submit" form="product-form" disabled={isSubmitting}>
                    {isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}
