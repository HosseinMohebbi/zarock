'use client';
import { useState } from "react";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/SelectInput";
import { Client, BankLogo } from "@/services/client";
import { createCheck } from "@/services/transaction";
import type { AddCheckPayload } from "@/services/transaction";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import { useParams } from "next/navigation";

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
    const [amount, setAmount] = useState("");
    const [fromClient, setFromClient] = useState("");
    const [toClient, setToClient] = useState("");
    const [checkNumber, setCheckNumber] = useState("");
    const [bank, setBank] = useState("");
    const [receiveDate, setReceiveDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [state, setState] = useState("None");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [attachment, setAttachment] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const { businessId } = useParams();

    const handleSave = async () => {
        try {
            setSaving(true);
            const payload: AddCheckPayload = {
                amount: Number(amount || 0),
                checkNumber,
                bank,
                receiveDate: receiveDate || new Date().toISOString(),
                dueDate: dueDate || new Date().toISOString(),
                fromClient,
                toClient,
                state,
                description,
                tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
            };
            await createCheck(businessId, payload);

            // reset
            setAmount("");
            setCheckNumber("");
            setBank("");
            setReceiveDate("");
            setDueDate("");
            setState("None");
            setDescription("");
            setTags("");
            setFromClient("");
            setToClient("");
            setAttachment(null);
        } catch (err) {
            console.error("failed to create check transaction", err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="grid gap-3">
            <Input label="مبلغ" value={amount} onChange={(e) => setAmount(e.target.value)} />

            <Select
                label="از مشتری"
                value={fromClient}
                onChange={setFromClient}
                placeholder={loadingClients ? "در حال بارگذاری..." : "انتخاب کنید"}
                options={clients.map((c) => ({ value: c.id, label: c.fullname }))}
            />

            <Select
                label="به مشتری"
                value={toClient}
                onChange={setToClient}
                placeholder={loadingClients ? "در حال بارگذاری..." : "انتخاب کنید"}
                options={clients.map((c) => ({ value: c.id, label: c.fullname }))}
            />

            <Input label="شماره چک" value={checkNumber} onChange={(e) => setCheckNumber(e.target.value)} />

            {/* بانک */}
            <Select
                label="بانک"
                value={bank}
                onChange={setBank}
                placeholder={loadingBanks ? "در حال بارگذاری..." : "انتخاب کنید"}
                options={banks.map((b) => ({
                    value: b.name,
                    label: b.name,
                    icon: b.url,
                }))}
            />

            {/* تاریخ دریافت */}
            <div className="field">
                <label className="label">تاریخ دریافت</label>
                <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    value={receiveDate ? dayjs(receiveDate).calendar("jalali").toDate() : null}
                    onChange={(date) =>
                        setReceiveDate(date ? dayjs(date.toDate()).toISOString() : "")
                    }
                    className="w-full border rounded-md px-3 py-2"
                />
            </div>

            {/* تاریخ سررسید */}
            <div className="field">
                <label className="label">تاریخ سررسید</label>
                <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    value={dueDate ? dayjs(dueDate).calendar("jalali").toDate() : null}
                    onChange={(date) =>
                        setDueDate(date ? dayjs(date.toDate()).toISOString() : "")
                    }
                    className="w-full border rounded-md px-3 py-2"
                />
            </div>

            {/* وضعیت چک */}
            <Select
                label="وضعیت"
                value={state}
                onChange={(val) => {
                    const map: Record<string, string> = {
                        "پاسی": "Pending",
                        "پاس": "Completed",
                        "برگشتی": "Returned",
                        "خرج شده": "Used",
                        "نقدی": "Cash",
                    };
                    setState(map[val] || "None");
                }}
                options={[
                    { value: "پاسی", label: "پاسی" },
                    { value: "پاس", label: "پاس" },
                    { value: "برگشتی", label: "برگشتی" },
                    { value: "خرج شده", label: "خرج شده" },
                    { value: "نقدی", label: "نقدی" },
                ]}
            />

            <Input label="توضیحات" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Input label="تگ‌ها (با کاما جدا کنید)" value={tags} onChange={(e) => setTags(e.target.value)} />

            {/* تصویر چک */}
            <div className="field">
                <label className="label">تصویر چک</label>
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
