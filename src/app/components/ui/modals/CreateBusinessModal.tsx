'use client';

import React, { useState } from 'react';
import Modal from '@/app/components/ui/Modal'; 
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';
import { cn } from '@/utils/cn';
import { addBusiness } from "@/services/business";
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

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (!name.trim() || !description.trim()) return;
    //
    //     try {
    //         await createBusiness({
    //             name,
    //             description,
    //             logo: file || undefined, // لوگو رو اضافه می‌کنیم
    //         });
    //
    //         await onCreated();
    //         setName('');
    //         setDescription('');
    //         setFile(null);
    //         onClose();
    //     } catch (err) {
    //         console.error(err);
    //         alert("خطا در ایجاد کسب‌وکار");
    //     }
    // };


    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (!name.trim() || !description.trim()) return;
    //
    //     try {
    //         // setLoading(true);
    //
    //         const result = await createBusiness({
    //             name,
    //             description,
    //         });
    //
    //         await onCreated();
    //
    //         console.log("✅ Business created:", result);
    //
    //         setName('');
    //         setDescription('');
    //         setFile(null);
    //         onClose();
    //     } catch (err) {
    //         console.error("❌ Error creating business:", err);
    //         alert("خطا در ایجاد کسب‌وکار");
    //     } finally {
    //         // setLoading(false);
    //     }
    // };

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
                
                {/* Name */}
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
                
                {/* File Upload */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        لوگو
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 dark:text-gray-300
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0
                       file:text-sm file:font-semibold
                       file:bg-green-100 file:text-green-700
                       hover:file:bg-green-200"
                    />
                    {file && (
                        <p className="text-xs text-gray-500 mt-1">
                            فایل انتخاب شده: {file.name}
                        </p>
                    )}
                </div>

                {/* Buttons */}
                {/*<div className="flex justify-end gap-3 mt-4">*/}
                {/*    <Button*/}
                {/*        type="button"*/}
                {/*        label="انصراف"*/}
                {/*        onClick={onClose}*/}
                {/*        customStyle="bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded-lg"*/}
                {/*    />*/}
                {/*    <Button*/}
                {/*        type="submit"*/}
                {/*        label="ایجاد"*/}
                {/*        customStyle="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white"*/}
                {/*    />*/}
                {/*</div>*/}
            </form>
        </Modal>
    );
}
