'use client';
import React, { useState } from 'react';
import Modal from '@/app/components/ui/Modal'; 
import Input from '@/app/components/ui/Input';
import { cn } from '@/utils/cn';
import {createBusinessWithLogo } from "@/services/business/business.service";

interface CreateBusinessModalProps {
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
}

export default function CreateBusinessModal({ open, onClose, onCreated }: CreateBusinessModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) setFile(selected);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !description.trim()) return;

        try {
            await createBusinessWithLogo(
                { name, description },
                file || undefined
            );

            await onCreated();

            setName("");
            setDescription("");
            setFile(null);
            onClose();
        } catch (err) {
            console.error(err);
            alert("خطا در ایجاد کسب‌وکار");
        }
    };


    return (
        <Modal open={open} onClose={onClose} onSubmit={handleSubmit} ariaLabel="Create Business Modal" modalTitle="ایجاد کسب و کار">
            <form
                onSubmit={handleSubmit}
                dir="rtl"
                className="flex flex-col gap-4 font-sans"
            >
                
                <Input
                    label="نام کسب‌وکار"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    containerClass={cn('w-full !mt-4')}
                    inputClass="h-[40px]"
                    required 
                    name={name}                
                />

                <Input
                    label="توضیحات"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    containerClass={cn('w-full')}
                    inputClass="h-[40px]"
                    required
                    name={description}
                />
                
                <div className="flex flex-col gap-2 mt-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        لوگو
                    </label>
                    
                    <label
                        htmlFor="logo-upload"
                        className="cursor-pointer w-auto bg-primary text-white text-center py-2 rounded-md shadow"
                    >
                        انتخاب لوگو
                    </label>
                    
                    <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    
                    {file && (
                        <p className="text-xs text-gray-500 mt-1">
                            فایل انتخاب شده: {file.name}
                        </p>
                    )}
                </div>
            </form>
        </Modal>
    );
}
