'use client';
import React, { useState } from "react";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/SelectInput";
import { Client } from "@/services/client/client.types";
import { createCash } from "@/services/transaction/transaction.service";
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


    // ----------------------------
    // ⭐ Single unified form state
    // ----------------------------
    const [form, setForm] = useState({
        amount: "",
        fromClient: "",
        toClient: "",
        trackingCode: "",
        cashDate: "",
        description: "",
        tags: "",
        attachment: null as File | null,
    });

    const [saving, setSaving] = useState(false);

    // reusable setter ✔️
    const update = (key: string, value: any) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        const validation  = cashValidate({
            trackingCode: form.trackingCode,
            amount: Number(form.amount),
            date: form.cashDate,
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
                date: form.cashDate || new Date().toISOString(),
                fromClient: form.fromClient,
                toClient: form.toClient,
                description: form.description,
                tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
            };

            await createCash(businessId, payload);
            router.push(`/business/${businessId}/transactions`);

            // reset form
            setForm({
                amount: "",
                fromClient: "",
                toClient: "",
                trackingCode: "",
                cashDate: "",
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
                        label="مبلغ"
                        value={form.amount}
                        onChange={(e) => update("amount", e.target.value)}
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
                                form.cashDate
                                    ? dayjs(form.cashDate).calendar("jalali").toDate()
                                    : new Date()
                            }
                            onChange={(date) =>
                                update("cashDate", date ? dayjs(date.toDate()).toISOString() : "")
                            }
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>

                    <Input
                        label="توضیحات"
                        value={form.description}
                        onChange={(e) => update("description", e.target.value)}
                    />

                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium">تصویر رسید</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                update("attachment", e.target.files?.[0] || null)
                            }
                            className="block w-full border rounded-md p-2 text-sm"
                        />

                        {form.attachment && (
                            <p className="text-xs text-gray-500 mt-1">
                                فایل انتخاب‌شده: {form.attachment.name}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-center mt-6">
                        <Button
                            label="ذخیره"
                            onClick={handleSave}
                            disabled={saving}
                            customStyle="!px-6 !py-2 bg-indigo-600 text-white !rounded-md"
                        />
                        <Button label="لغو" type="button" onClick={handleCancelForm}/>
                    </div>

                </div>
            </div>
        </div>
    );
}

// 'use client';
// import { useState } from "react";
// import Input from "@/app/components/ui/Input";
// import Select from "@/app/components/ui/SelectInput";
// import { Client } from "@/services/client/client.types";
// import { createCash } from "@/services/transaction";
// import type { AddCashPayload } from "@/services/transaction";
// import DatePicker from "react-multi-date-picker";
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";
// import dayjs from "dayjs";
// import jalaliday from "jalaliday";
// import { useParams } from "next/navigation";
//
// dayjs.extend(jalaliday);
//
// interface CashFormProps {
//     clients: Client[];
//     loadingClients: boolean;
// }
//
// export default function CashForm({ clients, loadingClients }: CashFormProps) {
//     const [amount, setAmount] = useState("");
//     const [fromClient, setFromClient] = useState("");
//     const [toClient, setToClient] = useState("");
//     const [trackingCode, setTrackingCode] = useState("");
//     const [cashDate, setCashDate] = useState("");
//     const [description, setDescription] = useState("");
//     const [tags, setTags] = useState("");
//     const [attachment, setAttachment] = useState<File | null>(null);
//     const [saving, setSaving] = useState(false);
//     const { businessId } = useParams();
//
//     const handleSave = async () => {
//         try {
//             setSaving(true);
//             const payload: AddCashPayload = {
//                 trackingCode,
//                 amount: Number(amount || 0),
//                 date: cashDate || new Date().toISOString(),
//                 fromClient,
//                 toClient,
//                 description,
//                 tags: tags.split(",").map(t => t.trim()).filter(Boolean),
//             };
//             await createCash(businessId, payload);
//
//             setAmount("");
//             setTrackingCode("");
//             setDescription("");
//             setTags("");
//             setFromClient("");
//             setToClient("");
//             setCashDate("");
//         } catch (err) {
//             console.error("failed to create cash transaction", err);
//         } finally {
//             setSaving(false);
//         }
//     };
//
//     return (
//         <div className="w-full flex justify-center px-4">
//             <div className="w-full max-w-lg mx-auto p-6 bg-background text-foreground rounded-lg shadow">
//                 <h2 className="text-xl font-semibold mb-6 text-center">ایجاد تراکنش نقدی</h2>
//
//                 <div className="flex flex-col gap-5">
//                     <Input
//                         label="مبلغ"
//                         value={amount}
//                         onChange={(e) => setAmount(e.target.value)}
//                     />
//
//                     <Select
//                         label="از مشتری"
//                         value={fromClient}
//                         onChange={setFromClient}
//                         placeholder={loadingClients ? "در حال بارگذاری..." : "انتخاب کنید"}
//                         options={clients.map(c => ({ value: c.id, label: c.fullname }))}
//                     />
//
//                     <Select
//                         label="به مشتری"
//                         value={toClient}
//                         onChange={setToClient}
//                         placeholder={loadingClients ? "در حال بارگذاری..." : "انتخاب کنید"}
//                         options={clients.map(c => ({ value: c.id, label: c.fullname }))}
//                     />
//
//                     <Input
//                         label="کد پیگیری"
//                         value={trackingCode}
//                         onChange={(e) => setTrackingCode(e.target.value)}
//                     />
//
//                     <div className="flex flex-col gap-2">
//                         <label className="text-lg font-medium">تاریخ</label>
//                         <DatePicker
//                             calendar={persian}
//                             locale={persian_fa}
//                             value={
//                                 cashDate ? dayjs(cashDate).calendar("jalali").toDate() : null
//                             }
//                             onChange={(date) =>
//                                 setCashDate(
//                                     date ? dayjs(date.toDate()).toISOString() : ""
//                                 )
//                             }
//                             className="w-full border rounded-md px-3 py-2"
//                         />
//                     </div>
//
//                     <Input
//                         label="توضیحات"
//                         value={description}
//                         onChange={(e) => setDescription(e.target.value)}
//                     />
//                    
//                     <div className="flex flex-col gap-2">
//                         <label className="text-lg font-medium">تصویر رسید</label>
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={(e) => setAttachment(e.target.files?.[0] || null)}
//                             className="block w-full border rounded-md p-2 text-sm"
//                         />
//                         {attachment && (
//                             <p className="text-xs text-gray-500 mt-1">
//                                 فایل انتخاب‌شده: {attachment.name}
//                             </p>
//                         )}
//                     </div>
//
//                     <div className="flex justify-center mt-6">
//                         <button
//                             onClick={handleSave}
//                             disabled={saving}
//                             className="px-6 py-2 bg-indigo-600 text-white rounded-md"
//                         >
//                             {saving ? "در حال ذخیره..." : "ذخیره"}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// 'use client';
// import { useState } from "react";
// import Input from "@/app/components/ui/Input";
// import Select from "@/app/components/ui/SelectInput";
// import { Client } from "@/services/client/client.types";
// import { createCash } from "@/services/transaction";
// import type { AddCashPayload } from "@/services/transaction";
// import DatePicker from "react-multi-date-picker";
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";
// import dayjs from "dayjs";
// import jalaliday from "jalaliday";
// import { useParams } from "next/navigation";
//
// dayjs.extend(jalaliday);
//
// interface CashFormProps {
//     clients: Client[];
//     loadingClients: boolean;
// }
//
// export default function CashForm({ clients, loadingClients }: CashFormProps) {
//     const [amount, setAmount] = useState("");
//     const [fromClient, setFromClient] = useState("");
//     const [toClient, setToClient] = useState("");
//     const [trackingCode, setTrackingCode] = useState("");
//     const [cashDate, setCashDate] = useState("");
//     const [description, setDescription] = useState("");
//     const [tags, setTags] = useState("");
//     const [attachment, setAttachment] = useState<File | null>(null);
//     const [saving, setSaving] = useState(false);
//     const { businessId } = useParams();
//
//     const handleSave = async () => {
//         try {
//             setSaving(true);
//             const payload: AddCashPayload = {
//                 trackingCode,
//                 amount: Number(amount || 0),
//                 date: cashDate || new Date().toISOString(),
//                 fromClient,
//                 toClient,
//                 description,
//                 tags: tags.split(",").map(t => t.trim()).filter(Boolean),
//             };
//             await createCash(businessId, payload);
//             setAmount("");
//             setTrackingCode("");
//             setDescription("");
//             setTags("");
//             setFromClient("");
//             setToClient("");
//             setCashDate("");
//         } catch (err) {
//             console.error("failed to create cash transaction", err);
//         } finally {
//             setSaving(false);
//         }
//     };
//
//     return (
//         <div className="grid gap-3">
//             <Input label="مبلغ" value={amount} onChange={e => setAmount(e.target.value)} />
//
//             <Select
//                 label="از مشتری"
//                 value={fromClient}
//                 onChange={setFromClient}
//                 placeholder={loadingClients ? "در حال بارگذاری..." : "انتخاب کنید"}
//                 options={clients.map(c => ({ value: c.id, label: c.fullname }))}
//             />
//
//             <Select
//                 label="به مشتری"
//                 value={toClient}
//                 onChange={setToClient}
//                 placeholder={loadingClients ? "در حال بارگذاری..." : "انتخاب کنید"}
//                 options={clients.map(c => ({ value: c.id, label: c.fullname }))}
//             />
//
//             <Input label="کد پیگیری" value={trackingCode} onChange={e => setTrackingCode(e.target.value)} />
//
//             <div className="field">
//                 <label className="label">تاریخ</label>
//                 <DatePicker
//                     calendar={persian}
//                     locale={persian_fa}
//                     value={cashDate ? dayjs(cashDate).calendar("jalali").toDate() : null}
//                     onChange={date => setCashDate(date ? dayjs(date.toDate()).toISOString() : "")}
//                     className="w-full border rounded-md px-3 py-2"
//                 />
//             </div>
//
//             <Input label="توضیحات" value={description} onChange={e => setDescription(e.target.value)} />
//             <Input label="تگ‌ها (با کاما جدا کنید)" value={tags} onChange={e => setTags(e.target.value)} />
//
//             <div className="field">
//                 <label className="label">تصویر رسید</label>
//                 <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => setAttachment(e.target.files?.[0] || null)}
//                     className="block w-full border rounded-md p-2 text-sm"
//                 />
//                 {attachment && (
//                     <p className="text-xs text-gray-500 mt-1">
//                         فایل انتخاب‌شده: {attachment.name}
//                     </p>
//                 )}
//             </div>
//
//             <button
//                 onClick={handleSave}
//                 disabled={saving}
//                 className="px-6 py-2 bg-indigo-600 text-white rounded-md mt-4"
//             >
//                 {saving ? "در حال ذخیره..." : "ذخیره"}
//             </button>
//         </div>
//     );
// }
//
