'use client';
import { useState } from "react";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/SelectInput";
import { Client } from "@/services/client/client.types";
import { createCash } from "@/services/transaction";
import type { AddCashPayload } from "@/services/transaction";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import { useParams } from "next/navigation";

dayjs.extend(jalaliday);

interface CashFormProps {
    clients: Client[];
    loadingClients: boolean;
}

export default function CashForm({ clients, loadingClients }: CashFormProps) {
    const [amount, setAmount] = useState("");
    const [fromClient, setFromClient] = useState("");
    const [toClient, setToClient] = useState("");
    const [trackingCode, setTrackingCode] = useState("");
    const [cashDate, setCashDate] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [attachment, setAttachment] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const { businessId } = useParams();

    const handleSave = async () => {
        try {
            setSaving(true);
            const payload: AddCashPayload = {
                trackingCode,
                amount: Number(amount || 0),
                date: cashDate || new Date().toISOString(),
                fromClient,
                toClient,
                description,
                tags: tags.split(",").map(t => t.trim()).filter(Boolean),
            };
            await createCash(businessId, payload);
            setAmount("");
            setTrackingCode("");
            setDescription("");
            setTags("");
            setFromClient("");
            setToClient("");
            setCashDate("");
        } catch (err) {
            console.error("failed to create cash transaction", err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="grid gap-3">
            <Input label="مبلغ" value={amount} onChange={e => setAmount(e.target.value)} />

            <Select
                label="از مشتری"
                value={fromClient}
                onChange={setFromClient}
                placeholder={loadingClients ? "در حال بارگذاری..." : "انتخاب کنید"}
                options={clients.map(c => ({ value: c.id, label: c.fullname }))}
            />

            <Select
                label="به مشتری"
                value={toClient}
                onChange={setToClient}
                placeholder={loadingClients ? "در حال بارگذاری..." : "انتخاب کنید"}
                options={clients.map(c => ({ value: c.id, label: c.fullname }))}
            />

            <Input label="کد پیگیری" value={trackingCode} onChange={e => setTrackingCode(e.target.value)} />

            <div className="field">
                <label className="label">تاریخ</label>
                <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    value={cashDate ? dayjs(cashDate).calendar("jalali").toDate() : null}
                    onChange={date => setCashDate(date ? dayjs(date.toDate()).toISOString() : "")}
                    className="w-full border rounded-md px-3 py-2"
                />
            </div>

            <Input label="توضیحات" value={description} onChange={e => setDescription(e.target.value)} />
            <Input label="تگ‌ها (با کاما جدا کنید)" value={tags} onChange={e => setTags(e.target.value)} />

            <div className="field">
                <label className="label">تصویر رسید</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                    className="block w-full border rounded-md p-2 text-sm"
                />
                {attachment && (
                    <p className="text-xs text-gray-500 mt-1">
                        فایل انتخاب‌شده: {attachment.name}
                    </p>
                )}
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md mt-4"
            >
                {saving ? "در حال ذخیره..." : "ذخیره"}
            </button>
        </div>
    );
}
