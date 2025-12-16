'use client';
import React, { useState } from "react";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/SelectInput";
import { Client } from "@/services/client/client.types";
import {createCash, uploadTransactionDocument} from "@/services/transaction/transaction.service";
import { AddCashPayload } from "@/services/transaction/transaction.types";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import {useParams, useRouter} from "next/navigation";
import Button from "@/app/components/ui/Button";
import {cashValidate} from "@/services/transaction/transaction.validation";

dayjs.extend(jalaliday);

interface CashFormProps {
    clients: Client[];
    loadingClients: boolean;
}

export default function CashForm({ clients, loadingClients }: CashFormProps) {
    const { businessId } = useParams();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const router = useRouter();
    
    const [form, setForm] = useState({
        amount: "",
        fromClient: "",
        toClient: "",
        trackingCode: "",
        date: "",
        description: "",
        tags: "",
        attachment: null as File | null,
    });

    const [saving, setSaving] = useState(false);
    
    const update = (key: string, value: any) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        const validation  = cashValidate({
            trackingCode: form.trackingCode,
            amount: Number(form.amount),
            date: form.date,
            fromClient: form.fromClient,
            toClient: form.toClient,
            description: form.description,
            tags: form.tags.split(",")
        });

        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            return;
        }

        try {
            setSaving(true);

            const payload: AddCashPayload = {
                trackingCode: form.trackingCode,
                amount: Number(form.amount || 0),
                date: form.date || new Date().toISOString(),
                fromClient: form.fromClient,
                toClient: form.toClient,
                description: form.description,
                tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
            };
            
            const created = await createCash(businessId, payload);
            
            if (form.attachment) {
                await uploadTransactionDocument(created.id, form.attachment);
            }

            router.push(`/business/${businessId}/transactions`);
            
            setForm({
                amount: "",
                fromClient: "",
                toClient: "",
                trackingCode: "",
                date: "",
                description: "",
                tags: "",
                attachment: null,
            });
        } catch (err) {
            console.error("failed to create cash transaction", err);
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
                    ایجاد تراکنش نقدی
                </h2>

                <div className="flex flex-col gap-5">

                    <Input
                        name="amount"
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
                        options={clients.map(c => ({ value: c.id, label: c.fullname }))}
                        error={errors.fromClient}
                    />

                    <Select
                        label="به مشتری"
                        value={form.toClient}
                        onChange={(v) => update("toClient", v)}
                        placeholder={loadingClients ? "در حال بارگذاری..." : "انتخاب کنید"}
                        options={clients.map(c => ({ value: c.id, label: c.fullname }))}
                        error={errors.toClient}
                    />

                    <Input
                        name="trackingCode"
                        label="کد پیگیری"
                        value={form.trackingCode}
                        onChange={(e) => update("trackingCode", e.target.value)}
                    />

                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium">تاریخ</label>
                        <DatePicker
                            calendar={persian}
                            locale={persian_fa}
                            value={
                                form.date
                                    ? dayjs(form.date).calendar("jalali").toDate()
                                    : new Date()
                            }
                            onChange={(date) =>
                                update("cashDate", date ? dayjs(date.toDate()).toISOString() : "")
                            }
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>

                    <Input
                        name="description"
                        label="توضیحات"
                        value={form.description}
                        onChange={(e) => update("description", e.target.value)}
                    />

                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium">تصویر رسید</label>
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer w-auto bg-primary text-white text-center py-2 rounded-md shadow"
                        >
                            افزودن
                        </label>
                        
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => update("attachment", e.target.files?.[0] || null)}
                        />
                        
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
