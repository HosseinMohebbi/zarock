'use client';

import React, { useEffect, useState } from 'react';
import Modal from "@/app/components/ui/Modal";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import { getBusinessById, updateBusiness } from "@/services/business/business.service";

export default function EditBusinessModal({ open, onClose, businessId, onUpdated }) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

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
            await updateBusiness(businessId, { name, description });
            onUpdated();
            onClose();
        } catch (err) {
            console.error("Error updating:", err);
            alert("خطایی در ویرایش رخ داد");
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
        </Modal>
    );
}
