'use client';
import React, { useEffect, useState } from 'react';
import Modal from "@/app/components/ui/Modal";
import Input from "@/app/components/ui/Input";
import { MdDelete } from 'react-icons/md';
import { deleteBusiness, getBusinessById, updateBusiness, uploadBusinessLogo } from "@/services/business/business.service";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import { toast } from "react-toastify";

interface EditBusinessModalProps {
    open: boolean;
    onClose: () => void;
    businessId: string | null;
    onUpdated: () => void;
}

export default function EditBusinessModal({ open, onClose, businessId, onUpdated }: EditBusinessModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    
    useEffect(() => {
        if (!open || !businessId) return;

        (async () => {
            try {
                const data = await getBusinessById(businessId);
                setName(data.name);
                setDescription(data.description);
                setLogoPreview(data.logoUrl || null);
            } catch (err) {
                console.error("Error loading business:", err);
            }
        })();
    }, [open, businessId]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // بروزرسانی نام و توضیحات
            await updateBusiness(businessId, { name, description });

            // اگر فایل لوگو انتخاب شده بود، آپلود کن
            if (logoFile) {
                await uploadBusinessLogo(businessId, logoFile);

                // دریافت اطلاعات تازه از سرور تا لوگو جدید نمایش داده بشه
                const updatedBusiness = await getBusinessById(businessId);
                setLogoPreview(updatedBusiness.logoUrl || null);
            }

            onUpdated();
            toast.success("ویرایش با موفقیت انجام شد");
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("خطا در ویرایش کسب و کار");
        }
    };

    const handleDelete = () => setShowConfirm(true);

    const confirmDelete = async () => {
        try {
            await deleteBusiness(businessId);
            setShowConfirm(false);
            onClose();
            onUpdated();
            toast.success("کسب و کار با موفقیت حذف شد");
        } catch (err) {
            console.error(err);
            toast.error("خطا در حذف کسب و کار");
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            onSubmit={handleSubmit}
            modalTitle="ویرایش کسب و کار"
            ariaLabel="Edit Business Modal"
            confirmButtonTitle="ویرایش"
        >
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                <Input
                    name="name"
                    label="نام کسب و کار"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <Input
                    name="description"
                    label="توضیحات"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
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
                    
                    {logoPreview && (
                        <img
                            src={logoPreview}
                            alt="Logo Preview"
                            className="mt-2 w-32 h-32 object-cover rounded-md border"
                        />
                    )}
                </div>

            </form>

            <div onClick={handleDelete} className="flex items-center gap-2 !mt-4 text-danger cursor-pointer">
                <MdDelete className='w-8 h-8'/>
                <p>حذف کسب و کار</p>
            </div>

            <ConfirmModal
                title="حذف کسب و کار"
                isOpen={showConfirm}
                message="از حذف این کسب و کار مطمئن هستید؟"
                onConfirm={confirmDelete}
                onCancel={() => setShowConfirm(false)}
            />
        </Modal>
    );
}
