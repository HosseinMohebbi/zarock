'use client';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/SelectInput";
import { getAllClients } from "@/services/client";
import { getCashById, updateCash } from "@/services/transaction";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
dayjs.extend(jalaliday);

export default function EditCashPage() {
    const { businessId, transactionId } = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [clients, setClients] = useState([]);

    const [form, setForm] = useState<any>({
        trackingCode: "",
        amount: "",
        date: "",
        fromClient: "",
        toClient: "",
        description: "",
        tags: "",
    });

    useEffect(() => {
        async function loadData() {
            try {
                const [cashData, clientsData] = await Promise.all([
                    getCashById(businessId, transactionId),
                    getAllClients({ page: 1, pageSize: 200 }, businessId),
                ]);

                setForm({
                    trackingCode: cashData.trackingCode,
                    amount: cashData.amount,
                    date: cashData.date,
                    fromClient: cashData.fromClient?.id,
                    toClient: cashData.toClient?.id,
                    description: cashData.description,
                    tags: cashData.tags.join(", "),
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
            router.push(`/business/${businessId}/transactions`);
        } catch (err) {
            console.error("Failed to update cash", err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-4">در حال بارگذاری...</div>;

    return (
        <div className="p-4 max-w-lg mx-auto">
            <h1 className="text-xl font-bold mb-4">ویرایش تراکنش نقدی</h1>

            <Input label="مبلغ" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            <Input label="کد پیگیری" value={form.trackingCode} onChange={(e) => setForm({ ...form, trackingCode: e.target.value })} />

            <Select
                label="از مشتری"
                value={form.fromClient}
                onChange={(val) => setForm({ ...form, fromClient: val })}
                options={clients.map((c) => ({ value: c.id, label: c.fullname }))}
            />

            <Select
                label="به مشتری"
                value={form.toClient}
                onChange={(val) => setForm({ ...form, toClient: val })}
                options={clients.map((c) => ({ value: c.id, label: c.fullname }))}
            />

            <div>
                <label>تاریخ</label>
                <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    value={dayjs(form.date).calendar("jalali").toDate()}
                    onChange={(d) => setForm({ ...form, date: dayjs(d.toDate()).toISOString() })}
                />
            </div>

            <Input label="توضیحات" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Input label="تگ‌ها" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />

            <button onClick={handleSave} disabled={saving} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md">
                {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
        </div>
    );
}
