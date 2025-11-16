'use client';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/SelectInput";
import { getAllClients, getBankLogos } from "@/services/client/client.service";
import { getCheckById, updateCheck } from "@/services/transaction";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
dayjs.extend(jalaliday);

export default function EditCheckPage() {
    const { businessId, transactionId } = useParams();
    const router = useRouter();

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
    });

    useEffect(() => {
        async function loadData() {
            try {
                const [checkData, clientsData, banksData] = await Promise.all([
                    getCheckById(businessId, transactionId),
                    getAllClients({ page: 1, pageSize: 200 }, businessId),
                    getBankLogos(),
                ]);

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
            router.push(`/business/${businessId}/transactions`);
        } catch (err) {
            console.error("Failed to update check", err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-4">در حال بارگذاری...</div>;

    return (
        <div className="p-4 max-w-lg mx-auto">
            <h1 className="text-xl font-bold mb-4">ویرایش چک</h1>

            <Input label="مبلغ" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            <Input label="شماره چک" value={form.checkNumber} onChange={(e) => setForm({ ...form, checkNumber: e.target.value })} />

            <Select
                label="بانک"
                value={form.bank}
                onChange={(val) => setForm({ ...form, bank: val })}
                options={banks.map((b) => ({ value: b.name, label: b.name }))}
            />

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
                <label>تاریخ دریافت</label>
                <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    value={dayjs(form.receiveDate).calendar("jalali").toDate()}
                    onChange={(d) => setForm({ ...form, receiveDate: dayjs(d.toDate()).toISOString() })}
                />
            </div>

            <div>
                <label>تاریخ سررسید</label>
                <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    value={dayjs(form.dueDate).calendar("jalali").toDate()}
                    onChange={(d) => setForm({ ...form, dueDate: dayjs(d.toDate()).toISOString() })}
                />
            </div>

            <Select
                label="وضعیت"
                value={form.state}
                onChange={(val) => setForm({ ...form, state: val })}
                options={[
                    { value: "Pending", label: "پاسی" },
                    { value: "Completed", label: "پاس" },
                    { value: "Returned", label: "برگشتی" },
                    { value: "Used", label: "خرج شده" },
                    { value: "Cash", label: "نقدی" },
                ]}
            />

            <Input label="توضیحات" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Input label="تگ‌ها" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />

            <button onClick={handleSave} disabled={saving} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md">
                {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
        </div>
    );
}
