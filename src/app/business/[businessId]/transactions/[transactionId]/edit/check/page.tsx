'use client';
import React, {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/SelectInput";
import {getAllClients, getBankLogos} from "@/services/client/client.service";
import {
    deleteCheck,
    getCheckById,
    updateCheck,
    uploadTransactionDocument
} from "@/services/transaction/transaction.service";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import Button from "@/app/components/ui/Button";
import {toast} from "react-toastify";
import {MdDelete} from "react-icons/md";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import TransactionDocument from "@/app/components/ui/TransactionDocument";

dayjs.extend(jalaliday);

export default function EditCheckPage() {
    const {businessId, transactionId} = useParams();
    console.log(businessId, transactionId);
    const router = useRouter();
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [clients, setClients] = useState([]);
    const [banks, setBanks] = useState([]);

    const [form, setForm] = useState<any>({
        amount: "",
        checkNumber: "",
        bank: "",
        receiveDate: "",
        dueDate: "",
        fromClient: "",
        toClient: "",
        state: "",
        description: "",
        tags: "",
        attachment: null as File | null,
        documentId: undefined as string | undefined,
    });

    useEffect(() => {
        async function loadData() {
            try {
                const [checkData, clientsData, banksData] = await Promise.all([
                    getCheckById(businessId, transactionId),
                    getAllClients({page: 1, pageSize: 200}, businessId),
                    getBankLogos(),
                ]);

                console.log(checkData.id);

                setForm({
                    amount: checkData.amount,
                    checkNumber: checkData.checkNumber,
                    bank: checkData.bank,
                    receiveDate: checkData.receiveDate,
                    dueDate: checkData.dueDate,
                    fromClient: checkData.fromClient?.id,
                    toClient: checkData.toClient?.id,
                    state: checkData.state,
                    description: checkData.description,
                    tags: checkData.tags.join(", "),
                    attachment: null,
                    documentId: checkData.document?.id,
                });
                setClients(clientsData);
                setBanks(banksData);
            } catch (err) {
                console.error("Failed to load check data", err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [businessId, transactionId]);


    const handleSave = async () => {
        try {
            setSaving(true);
            await updateCheck(businessId, transactionId, {
                ...form,
                amount: Number(form.amount),
                tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
            });

            if (form.attachment) {
                await uploadTransactionDocument(transactionId, form.attachment);
            }
            
            router.push(`/business/${businessId}/transactions`);
        } catch (err) {
            console.error("Failed to update check", err);
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

            await deleteCheck(businessId, transactionId);

            toast.success("چک با موفقیت حذف شد");

            router.push(`/business/${businessId}/transactions`);
        } catch (err) {
            toast.error("حذف چک با خطا مواجه شد");
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
                    <h2 className="!mx-auto text-xl font-semibold !mb-4 text-center">ویرایش چک</h2>
                </div>

                <div className="flex flex-col gap-5">

                    <Input
                        name="amount"
                        label="مبلغ"
                        value={form.amount}
                        onChange={(e) => setForm({...form, amount: e.target.value})}
                    />

                    <Select
                        label="به مشتری"
                        value={form.toClient}
                        onChange={(val) => setForm({...form, toClient: val})}
                        options={clients.map((c) => ({value: c.id, label: c.fullname}))}
                    />

                    <Input
                        name="checkNumber"
                        label="شماره چک"
                        value={form.checkNumber}
                        onChange={(e) => setForm({...form, checkNumber: e.target.value})}
                    />

                    <Select
                        label="بانک"
                        value={form.bank}
                        onChange={(val) => setForm({...form, bank: val})}
                        options={banks.map((b) => ({value: b.name, label: b.name}))}
                    />

                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium">تاریخ دریافت</label>
                        <DatePicker
                            calendar={persian}
                            locale={persian_fa}
                            value={dayjs(form.receiveDate).calendar("jalali").toDate()}
                            onChange={(d) => setForm({...form, receiveDate: dayjs(d.toDate()).toISOString()})}
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium">تاریخ سررسید</label>
                        <DatePicker
                            calendar={persian}
                            locale={persian_fa}
                            value={dayjs(form.dueDate).calendar("jalali").toDate()}
                            onChange={(d) => setForm({...form, dueDate: dayjs(d.toDate()).toISOString()})}
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>

                    <Select
                        label="وضعیت"
                        value={form.state}
                        onChange={(val) => setForm({...form, state: val})}
                        options={[
                            {value: "None", label: "پاسی"},
                            {value: "Passed", label: "پاس"},
                            {value: "Bounced", label: "برگشتی"},
                            {value: "Expended", label: "خرج شده"},
                            {value: "Cashed", label: "نقدی"},
                        ]}
                    />

                    <Input
                        name="description"
                        label="توضیحات"
                        value={form.description}
                        onChange={(e) => setForm({...form, description: e.target.value})}
                    />

                    {form.documentId && (
                        <div className="flex items-center gap-3">
                            <TransactionDocument docId={form.documentId} transactionTitle="نمایش چک"/>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer w-auto bg-primary text-white text-center py-2 rounded-md shadow"
                        >
                            جایگزینی چک
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
            <ConfirmModal title="حذف چک" isOpen={showConfirm}
                          message="آیا از حذف این تراکنش مطمئن هستید؟ این عملیات غیر قابل بازگشت است."
                          onConfirm={confirmDelete} onCancel={() => setShowConfirm(false)}/>
        </div>
    );
}
