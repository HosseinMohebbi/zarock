'use client';

import React, { useEffect, useState } from 'react';
import Modal from "@/app/components/ui/Modal";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import { MdDelete } from 'react-icons/md';
import { deleteBusiness, getBusinessById, updateBusiness, uploadBusinessLogo } from "@/services/business/business.service";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import { toast } from "react-toastify";

interface EditBusinessModalProps {
    open: boolean;
    onClose: () => void;
    businessId: string;
    onUpdated: () => void;
}

export default function EditBusinessModal({ open, onClose, businessId, onUpdated }: EditBusinessModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    // دریافت داده‌های کسب‌وکار برای مقدار اولیه
    useEffect(() => {
        if (!open || !businessId) return;

        (async () => {
            try {
                const data = await getBusinessById(businessId);
                setName(data.name);
                setDescription(data.description);
                setLogoPreview(data.logoUrl || null); // فرض بر اینکه API لوگو URL میده
            } catch (err) {
                console.error("Error loading business:", err);
            }
        })();
    }, [open, businessId]);

    // مدیریت تغییر فایل لوگو
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file)); // پیش‌نمایش فوری
        }
    };

    // ارسال فرم
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

            onUpdated(); // رفرش لیست کسب‌وکارها در parent
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
                    label="نام کسب و کار"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <Input
                    label="توضیحات"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                {/* لوگو */}
                <div className="flex flex-col gap-2 mt-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        لوگو
                    </label>

                    {/* دکمه آپلود سفارشی */}
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

                    {/* پیش‌نمایش لوگو */}
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

// 'use client';
//
// import React, { useEffect, useState } from 'react';
// import Modal from "@/app/components/ui/Modal";
// import Input from "@/app/components/ui/Input";
// import { MdDelete } from 'react-icons/md';
// import {
//     deleteBusiness,
//     getBusinessById,
//     updateBusiness,
//     updateBusinessWithLogo
// } from "@/services/business/business.service";
// import ConfirmModal from "@/app/components/ui/ConfirmModal";
// import { toast } from "react-toastify";
//
// export default function EditBusinessModal({ open, onClose, businessId, onUpdated }) {
//
//     const [name, setName] = useState("");
//     const [description, setDescription] = useState("");
//     const [file, setFile] = useState<File | null>(null); // ⬅ اضافه شد
//
//     const [showConfirm, setShowConfirm] = useState(false);
//
//     // دریافت اطلاعات اولیه
//     useEffect(() => {
//         if (!open || !businessId) return;
//
//         (async () => {
//             try {
//                 const data = await getBusinessById(businessId);
//                 setName(data.name);
//                 setDescription(data.description);
//             } catch (err) {
//                 console.error("Error loading business:", err);
//             }
//         })();
//     }, [open, businessId]);
//
//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const selected = e.target.files?.[0];
//         if (selected) setFile(selected);
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//
//         try {
//             // اگر فایل وجود داشت با لوگو آپدیت کن، وگرنه بدون لوگو
//             await updateBusinessWithLogo(businessId, { name, description }, file || undefined);
//
//
//             onUpdated();
//             onClose();
//         } catch (err) {
//             console.error("Error updating:", err);
//             toast.error("خطایی در ویرایش رخ داد");
//         }
//     };
//
//     function handleDelete() {
//         setShowConfirm(true);
//     }
//
//     const confirmDelete = async () => {
//         try {
//             await deleteBusiness(businessId);
//             setShowConfirm(false);
//             onClose();
//             onUpdated();
//             toast.success("کسب و کار با موفقیت حذف شد");
//         } catch (err) {
//             console.error(err);
//             toast.error("خطا در حذف کسب و کار");
//         }
//     };
//
//     return (
//         <Modal
//             open={open}
//             onClose={onClose}
//             onSubmit={handleSubmit}
//             modalTitle="ویرایش کسب و کار"
//             ariaLabel="Edit Business Modal"
//             confirmButtonTitle="ویرایش"
//         >
//             <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
//
//                 <Input
//                     label="نام کسب و کار"
//                     name="name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     required
//                 />
//
//                 <Input
//                     label="توضیحات"
//                     name="description"
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     required
//                 />
//
//                 {/* 🔥 بخش انتخاب لوگو - همان استایل فرم ایجاد */}
//                 <div className="flex flex-col gap-2 mt-2">
//                     <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                         لوگوی جدید (اختیاری)
//                     </label>
//
//                     <label
//                         htmlFor="logo-upload-edit"
//                         className="cursor-pointer w-auto bg-primary text-white text-center py-2 rounded-md shadow"
//                     >
//                         انتخاب لوگو
//                     </label>
//
//                     <input
//                         id="logo-upload-edit"
//                         type="file"
//                         accept="image/*"
//                         className="hidden"
//                         onChange={handleFileChange}
//                     />
//
//                     {file && (
//                         <p className="text-xs text-gray-500 mt-1">
//                             فایل انتخاب شده: {file.name}
//                         </p>
//                     )}
//                 </div>
//
//             </form>
//
//             {/* دکمه حذف */}
//             <div onClick={handleDelete} className="flex items-center gap-2 !mt-4 text-danger cursor-pointer">
//                 <MdDelete className='w-8 h-8' />
//                 <p>حذف کسب و کار</p>
//             </div>
//
//             <ConfirmModal
//                 title="حذف کسب و کار"
//                 isOpen={showConfirm}
//                 message="از حذف این کسب و کار مطمئن هستید؟"
//                 onConfirm={confirmDelete}
//                 onCancel={() => setShowConfirm(false)}
//             />
//         </Modal>
//     );
// }


// 'use client';
//
// import React, {useEffect, useState} from 'react';
// import Modal from "@/app/components/ui/Modal";
// import Input from "@/app/components/ui/Input";
// import Button from "@/app/components/ui/Button";
// import {MdDelete} from 'react-icons/md';
// import {deleteBusiness, getBusinessById, updateBusiness} from "@/services/business/business.service";
// import ConfirmModal from "@/app/components/ui/ConfirmModal";
// import {Toast} from "next/dist/next-devtools/dev-overlay/components/toast";
// import {toast} from "react-toastify";
//
// export default function EditBusinessModal({open, onClose, businessId, onUpdated,}) {
//
//     const [name, setName] = useState("");
//     const [description, setDescription] = useState("");
//     const [showConfirm, setShowConfirm] = useState(false);
//
//     // --- دریافت دیتای بیزینس برای مقدار اولیه ---
//     useEffect(() => {
//         if (!open || !businessId) return;
//
//         (async () => {
//             try {
//                 const data = await getBusinessById(businessId);
//                 setName(data.name);
//                 setDescription(data.description);
//             } catch (err) {
//                 console.error("Error loading business:", err);
//             }
//         })();
//     }, [open, businessId]);
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//
//         try {
//             await updateBusiness(businessId, {name, description});
//             onUpdated();
//             onClose();
//         } catch (err) {
//             console.error("Error updating:", err);
//             alert("خطایی در ویرایش رخ داد");
//         }
//     };
//         function handleDelete() {
//             setShowConfirm(true);
//         }
//
//     const confirmDelete = async () => {
//         try {
//             await deleteBusiness(businessId);   // حذف از سرور
//             setShowConfirm(false);              // بستن مودال تأیید
//             onClose();                          // بستن مودال اصلی
//             onUpdated();                        // رفرش لیست در صفحه اصلی
//             toast.success("کسب و کار با موفقیت حذف شد")
//         } catch (err) {
//             console.error(err);
//             toast.error("خطا در حذف کسب و کار")
//         }
//     };
//    
//     return (
//         <Modal
//             open={open}
//             onClose={onClose}
//             onSubmit={handleSubmit}
//             modalTitle="ویرایش کسب و کار"
//             ariaLabel="Edit Business Modal"
//             confirmButtonTitle="ویرایش"
//         >
//            
//             <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
//
//                 <Input
//                     label="نام کسب و کار"
//                     name={name}
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     required
//                 />
//
//                 <Input
//                     label="توضیحات"
//                     name={description}
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     required
//                 />
//
//             </form>
//             <div onClick={handleDelete} className="flex items-center gap-2 !mt-4 text-danger cursor-pointer">
//                 <MdDelete className='w-8 h-8'/>
//                 <p>حذف کسب و کار</p>
//             </div>
//             <ConfirmModal title="حذف کسب و کار" isOpen={showConfirm} message="از حذف این کسب و کار مطمئن هستید؟" onConfirm={confirmDelete} onCancel={() => setShowConfirm(false)} />
//         </Modal>
//     );
// }
