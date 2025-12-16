// 'use client';
// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Input from "@/app/components/ui/Input";
// import Select from "@/app/components/ui/SelectInput";
// import { getAllClients } from "@/services/client/client.service";
// import { getCashById, updateCash } from "@/services/transaction/transaction.service";
// import DatePicker from "react-multi-date-picker";
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";
// import dayjs from "dayjs";
// import jalaliday from "jalaliday";
// dayjs.extend(jalaliday);
//
// export default function EditCashPage() {
//     const { businessId, transactionId } = useParams();
//     const router = useRouter();
//
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);
//     const [clients, setClients] = useState([]);
//
//     const [form, setForm] = useState<any>({
//         trackingCode: "",
//         amount: "",
//         date: "",
//         fromClient: "",
//         toClient: "",
//         description: "",
//         tags: "",
//     });
//
//     useEffect(() => {
//         async function loadData() {
//             try {
//                 const [cashData, clientsData] = await Promise.all([
//                     getCashById(businessId, transactionId),
//                     getAllClients({ page: 1, pageSize: 200 }, businessId),
//                 ]);
//
//                 setForm({
//                     trackingCode: cashData.trackingCode,
//                     amount: cashData.amount,
//                     date: cashData.date,
//                     fromClient: cashData.fromClient?.id,
//                     toClient: cashData.toClient?.id,
//                     description: cashData.description,
//                     tags: cashData.tags.join(", "),
//                 });
//                 setClients(clientsData);
//             } catch (err) {
//                 console.error("Failed to load cash data", err);
//             } finally {
//                 setLoading(false);
//             }
//         }
//         loadData();
//     }, [businessId, transactionId]);
//
//     const handleSave = async () => {
//         try {
//             setSaving(true);
//             await updateCash(businessId, transactionId, {
//                 ...form,
//                 amount: Number(form.amount),
//                 tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
//             });
//             router.push(`/business/${businessId}/transactions`);
//         } catch (err) {
//             console.error("Failed to update cash", err);
//         } finally {
//             setSaving(false);
//         }
//     };
//
//     if (loading) return <div className="p-4">در حال بارگذاری...</div>;
//
//     return (
//         <div className="p-4 max-w-lg mx-auto">
//             <h1 className="text-xl font-bold mb-4">ویرایش تراکنش نقدی</h1>
//
//             <Input label="مبلغ" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
//             <Input label="کد پیگیری" value={form.trackingCode} onChange={(e) => setForm({ ...form, trackingCode: e.target.value })} />
//
//             <Select
//                 label="از مشتری"
//                 value={form.fromClient}
//                 onChange={(val) => setForm({ ...form, fromClient: val })}
//                 options={clients.map((c) => ({ value: c.id, label: c.fullname }))}
//             />
//
//             <Select
//                 label="به مشتری"
//                 value={form.toClient}
//                 onChange={(val) => setForm({ ...form, toClient: val })}
//                 options={clients.map((c) => ({ value: c.id, label: c.fullname }))}
//             />
//
//             <div>
//                 <label>تاریخ</label>
//                 <DatePicker
//                     calendar={persian}
//                     locale={persian_fa}
//                     value={dayjs(form.date).calendar("jalali").toDate()}
//                     onChange={(d) => setForm({ ...form, date: dayjs(d.toDate()).toISOString() })}
//                 />
//             </div>
//
//             <Input label="توضیحات" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
//
//             <button onClick={handleSave} disabled={saving} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md">
//                 {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
//             </button>
//         </div>
//     );
// }

'use client';
import React, {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/SelectInput";
import {getAllClients} from "@/services/client/client.service";
import {
    getCashById,
    updateCash,
    deleteCash,
    uploadTransactionDocument
} from "@/services/transaction/transaction.service";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import Button from "@/app/components/ui/Button";
import {MdDelete} from "react-icons/md";
import {toast} from "react-toastify";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import TransactionDocument from "@/app/components/ui/TransactionDocument";

dayjs.extend(jalaliday);

export default function EditCashPage() {
    const {businessId, transactionId} = useParams();

    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [clients, setClients] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);

    const [form, setForm] = useState<any>({
        trackingCode: "",
        amount: "",
        date: "",
        fromClient: "",
        toClient: "",
        description: "",
        tags: "",
        attachment: null as File | null,
        documentId: undefined as string | undefined,
    });

    useEffect(() => {
        async function loadData() {
            try {
                const [cashData, clientsData] = await Promise.all([
                    getCashById(businessId, transactionId),
                    getAllClients({page: 1, pageSize: 200}, businessId),
                ]);

                setForm({
                    trackingCode: cashData.trackingCode,
                    amount: cashData.amount,
                    date: cashData.date,
                    fromClient: cashData.fromClient?.id,
                    toClient: cashData.toClient?.id,
                    description: cashData.description,
                    tags: cashData.tags.join(", "),
                    attachment: null,
                    documentId: cashData.document?.id,
                });
                setClients(clientsData);
            } catch (err) {
                console.error("Failed to load cash data", err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [businessId, transactionId]);

    const handleSave = async () => {
        try {
            setSaving(true);
            await updateCash(businessId, transactionId, {
                ...form,
                amount: Number(form.amount),
                tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
            });
            
            if (form.attachment) {
                await uploadTransactionDocument(transactionId, form.attachment);
            }
            
            router.push(`/business/${businessId}/transactions`);
        } catch (err) {
            console.error("Failed to update cash", err);
        } finally {
            setSaving(false);
        }
    };

    function handleDelete() {
        setShowConfirm(true);
    }

    async function confirmDelete() {
        try {
            setShowConfirm(false);

            await deleteCash(businessId, transactionId);

            toast.success("تراکنش با موفقیت حذف شد");

            router.push(`/business/${businessId}/transactions`);
        } catch (err) {
            toast.error("حذف تراکنش با خطا مواجه شد");
            console.error(err);
        }
    }

    function handleCancelForm() {
        router.push(`/business/${businessId}/transactions`);
    }

    return (
        <div className="w-full flex justify-center !px-4 !pt-24">
            <div className="w-full max-w-lg mx-auto !p-6 bg-background text-foreground !rounded-lg shadow">

                <div className="relative w-full flex items-start">
                    <div onClick={handleDelete} className="absolute right-0 text-danger cursor-pointer">
                        <MdDelete className='w-6 h-6'/>
                    </div>
                    <h2 className="!mx-auto text-xl font-semibold !mb-4 text-center">ویرایش تراکنش نقدی</h2>
                </div>

                <div className="flex flex-col gap-5">

                    <Input
                        name="amount"
                        label="مبلغ"
                        value={form.amount}
                        onChange={(e) => setForm({...form, amount: e.target.value})}
                    />

                    <Input
                        name="trackingCode"
                        label="کد پیگیری"
                        value={form.trackingCode}
                        onChange={(e) => setForm({...form, trackingCode: e.target.value})}
                    />

                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium">تاریخ</label>
                        <DatePicker
                            calendar={persian}
                            locale={persian_fa}
                            value={dayjs(form.date).calendar("jalali").toDate()}
                            onChange={(d) =>
                                setForm({
                                    ...form,
                                    date: dayjs(d.toDate()).toISOString(),
                                })
                            }
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>

                    <Input
                        name="description"
                        label="توضیحات"
                        value={form.description}
                        onChange={(e) =>
                            setForm({...form, description: e.target.value})
                        }
                    />

                    {form.documentId && (
                        <div className="flex items-center gap-3">
                            <TransactionDocument docId={form.documentId} transactionTitle="نمایش رسید"/>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer w-auto bg-primary text-white text-center py-2 rounded-md shadow"
                        >
                            جایگزینی رسید
                        </label>

                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    attachment: e.target.files?.[0] || null,
                                })
                            }
                        />

                        {form.attachment && (
                            <p className="text-xs text-gray-500 mt-1">
                                فایل جدید: {form.attachment.name}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end items-center gap-3 mt-3">
                        <Button
                            label="لغو"
                            onClick={handleCancelForm}
                            disabled={saving}
                            customStyle="!px-6 !py-2 !bg-danger text-white !rounded-md"
                        />
                        <Button
                            label="ویرایش"
                            onClick={handleSave}
                            disabled={saving}
                            customStyle="!px-6 !py-2 !bg-confirm text-white !rounded-md"
                        />
                    </div>
                </div>
            </div>
            <ConfirmModal title="حذف تراکنش" isOpen={showConfirm}
                          message="آیا از حذف این تراکنش مطمئن هستید؟ این عملیات غیر قابل بازگشت است."
                          onConfirm={confirmDelete}
                          onCancel={() => setShowConfirm(false)}/>
        </div>
    );
}

