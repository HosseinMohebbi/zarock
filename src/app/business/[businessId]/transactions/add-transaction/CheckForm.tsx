'use client';
import React, { useState } from "react";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/SelectInput";
import { Client, BankLogo } from "@/services/client/client.types";
import {createCheck, uploadTransactionDocument} from "@/services/transaction/transaction.service";
import { AddCheckPayload } from "@/services/transaction/transaction.types";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import {useParams, useRouter} from "next/navigation";
import Button from "@/app/components/ui/Button";
import {checkValidate} from "@/services/transaction/transaction.validation";

dayjs.extend(jalaliday);

interface CheckFormProps {
    clients: Client[];
    banks: BankLogo[];
    loadingClients: boolean;
    loadingBanks: boolean;
}

export default function CheckForm({
                                      clients,
                                      banks,
                                      loadingClients,
                                      loadingBanks,
                                  }: CheckFormProps) {

    const { businessId } = useParams();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const router = useRouter();

    // ----------------------------
    // ⭐ Unified Single Form State
    // ----------------------------
    const [form, setForm] = useState({
        amount: "",
        fromClient: "",
        toClient: "",
        checkNumber: "",
        bank: "",
        receiveDate: "",
        dueDate: "",
        state: "None",
        description: "",
        tags: "",
        attachment: null as File | null,
    });

    const update = (key: string, value: any) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        const validation = checkValidate({
            amount: Number(form.amount),
            checkNumber: form.checkNumber,
            bank: form.bank,
            receiveDate: form.receiveDate,
            dueDate: form.dueDate,
            fromClient: form.fromClient,
            toClient: form.toClient,
            state: form.state,
            description: form.description,
            tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        });

        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            return;
        }
        
        try {
            setSaving(true);

            const payload: AddCheckPayload = {
                amount: Number(form.amount || 0),
                checkNumber: form.checkNumber,
                bank: form.bank,
                receiveDate: form.receiveDate || new Date().toISOString(),
                dueDate: form.dueDate || new Date().toISOString(),
                fromClient: form.fromClient,
                toClient: form.toClient,
                state: form.state,
                description: form.description,
                tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
            };
            
            console.log(payload)

            const created = await createCheck(businessId, payload);

            if (form.attachment) {
                await uploadTransactionDocument(created.id, form.attachment);
            }

            router.push(`/business/${businessId}/transactions`);

            // Reset form
            setForm({
                amount: "",
                fromClient: "",
                toClient: "",
                checkNumber: "",
                bank: "",
                receiveDate: "",
                dueDate: "",
                state: "None",
                description: "",
                tags: "",
                attachment: null,
            });

        } catch (err) {
            console.error("failed to create check transaction", err);
        } finally {
            setSaving(false);
        }
    };

    function handleCancelForm() {
        router.push(`/business/${businessId}/transactions`);
    }

    return (
        <div className="w-full flex justify-center !px-4">
            <div className="w-full max-w-lg mx-auto !p-6 bg-background text-foreground !rounded-lg shadow">

                <h2 className="text-xl font-semibold !mb-6 text-center">
                    ایجاد تراکنش چک
                </h2>

                <div className="flex flex-col gap-5">

                    <Input
                        label="مبلغ"
                        value={form.amount}
                        onChange={(e) => update("amount", e.target.value)}
                        error={errors.amount}
                    />

                    <Select
                        label="از مشتری"
                        value={form.fromClient}
                        onChange={(v) => update("fromClient", v)}
                        placeholder={loadingClients ? "در حال بارگذاری..." : "انتخاب کنید"}
                        options={clients.map((c) => ({ value: c.id, label: c.fullname }))}
                        error={errors.fromClient}
                    />

                    <Select
                        label="به مشتری"
                        value={form.toClient}
                        onChange={(v) => update("toClient", v)}
                        placeholder={loadingClients ? "در حال بارگذاری..." : "انتخاب کنید"}
                        options={clients.map((c) => ({ value: c.id, label: c.fullname }))}
                        error={errors.toClient}
                    />

                    <Input
                        label="شماره چک"
                        value={form.checkNumber}
                        onChange={(e) => update("checkNumber", e.target.value)}
                        error={errors.checkNumber}
                    />

                    <Select
                        label="بانک"
                        value={form.bank}
                        onChange={(v) => update("bank", v)}
                        placeholder={loadingBanks ? "در حال بارگذاری..." : "انتخاب کنید"}
                        options={banks.map((b) => ({
                            value: b.name,
                            label: b.name,
                            icon: b.url,
                        }))}
                        error={errors.bank}
                    />

                    {/* تاریخ دریافت */}
                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium">تاریخ دریافت</label>
                        <DatePicker
                            calendar={persian}
                            locale={persian_fa}
                            value={
                                form.receiveDate
                                    ? dayjs(form.receiveDate).calendar("jalali").toDate()
                                    : new Date()
                            }
                            onChange={(date) =>
                                update("receiveDate", date ? dayjs(date.toDate()).toISOString() : "")
                            }
                            className="w-full border rounded-md px-3 py-2"
                            
                        />
                    </div>

                    {/* تاریخ سررسید */}
                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium">تاریخ سررسید</label>
                        <DatePicker
                            calendar={persian}
                            locale={persian_fa}
                            value={
                                form.dueDate
                                    ? dayjs(form.dueDate).calendar("jalali").toDate()
                                    : new Date()
                            }
                            onChange={(date) =>
                                update("dueDate", date ? dayjs(date.toDate()).toISOString() : "")
                            }
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>

                    {/* وضعیت */}
                    <Select
                        label="وضعیت"
                        value={form.state}
                        onChange={(v) => update("state", v)}
                        options={[
                            { value: "None", label: "پاسی" },
                            { value: "Passed", label: "پاس" },
                            { value: "Bounced", label: "برگشتی" },
                            { value: "Expended", label: "خرج شده" },
                            { value: "Cashed", label: "نقدی" },
                        ]}
                        error={errors.state}
                    />

                    <Input
                        label="توضیحات"
                        value={form.description}
                        onChange={(e) => update("description", e.target.value)}
                    />
                    

                    {/* تصویر چک */}
                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium">تصویر رسید</label>

                        {/* دکمه‌ی سفارشی برای انتخاب فایل */}
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer w-auto bg-primary text-white text-center py-2 rounded-md shadow"
                        >
                            تصویر سند
                        </label>

                        {/* ورودی فایل مخفی */}
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => update("attachment", e.target.files?.[0] || null)}
                        />

                        {/* نمایش نام فایل (اختیاری) */}
                        {form.attachment && (
                            <p className="text-xs text-gray-500 mt-1">
                                فایل انتخاب شده: {form.attachment.name}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end items-center gap-2 ">
                        <Button label="لغو" type="button" onClick={handleCancelForm} customStyle="!bg-danger"/>
                        <Button
                            label="ذخیره"
                            onClick={handleSave}
                            disabled={saving}
                            customStyle="!bg-confirm"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}
