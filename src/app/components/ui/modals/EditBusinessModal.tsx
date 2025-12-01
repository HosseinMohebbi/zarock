'use client';

import React, {useEffect, useState} from 'react';
import Modal from "@/app/components/ui/Modal";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import {MdDelete} from 'react-icons/md';
import {deleteBusiness, getBusinessById, updateBusiness} from "@/services/business/business.service";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import {Toast} from "next/dist/next-devtools/dev-overlay/components/toast";
import {toast} from "react-toastify";

export default function EditBusinessModal({open, onClose, businessId, onUpdated,}) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);

    // --- دریافت دیتای بیزینس برای مقدار اولیه ---
    useEffect(() => {
        if (!open || !businessId) return;

        (async () => {
            try {
                const data = await getBusinessById(businessId);
                setName(data.name);
                setDescription(data.description);
            } catch (err) {
                console.error("Error loading business:", err);
            }
        })();
    }, [open, businessId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updateBusiness(businessId, {name, description});
            onUpdated();
            onClose();
        } catch (err) {
            console.error("Error updating:", err);
            alert("خطایی در ویرایش رخ داد");
        }
    };
        function handleDelete() {
            setShowConfirm(true);
        }

    const confirmDelete = async () => {
        try {
            await deleteBusiness(businessId);   // حذف از سرور
            setShowConfirm(false);              // بستن مودال تأیید
            onClose();                          // بستن مودال اصلی
            onUpdated();                        // رفرش لیست در صفحه اصلی
            toast.success("کسب و کار با موفقیت حذف شد")
        } catch (err) {
            console.error(err);
            toast.error("خطا در حذف کسب و کار")
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
                    label="نام کسب و کار"
                    name={name}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <Input
                    label="توضیحات"
                    name={description}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

            </form>
            <div onClick={handleDelete} className="flex items-center gap-2 !mt-4 text-danger cursor-pointer">
                <MdDelete className='w-8 h-8'/>
                <p>حذف کسب و کار</p>
            </div>
            <ConfirmModal title="حذف کسب و کار" isOpen={showConfirm} message="از حذف این کسب و کار مطمئن هستید؟" onConfirm={confirmDelete} onCancel={() => setShowConfirm(false)} />
        </Modal>
    );
}
