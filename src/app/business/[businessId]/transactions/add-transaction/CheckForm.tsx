'use client';
import { useState } from "react";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/SelectInput";
import { Client, BankLogo } from "@/services/client/client.types";
import { createCheck } from "@/services/transaction/transaction.service";
import { AddCheckPayload } from "@/services/transaction/transaction.types";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import { useParams } from "next/navigation";
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

            await createCheck(businessId, payload);

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
                        onChange={(val) => {
                            const map: Record<string, string> = {
                                "پاسی": "None",
                                "پاس": "Passed",
                                "برگشتی": "Bounced",
                                "خرج شده": "Expended",
                                "نقدی": "Cashed",
                            };
                            update("state", map[val] || "None");
                        }}
                        options={[
                            { value: "پاسی", label: "پاسی" },
                            { value: "پاس", label: "پاس" },
                            { value: "برگشتی", label: "برگشتی" },
                            { value: "خرج شده", label: "خرج شده" },
                            { value: "نقدی", label: "نقدی" },
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
                        <label className="text-lg font-medium">تصویر چک</label>
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
// import { Client, BankLogo } from "@/services/client/client.types";
// import { createCheck } from "@/services/transaction";
// import type { AddCheckPayload } from "@/services/transaction";
// import DatePicker from "react-multi-date-picker";
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";
// import dayjs from "dayjs";
// import jalaliday from "jalaliday";
// import { useParams } from "next/navigation";
//
// dayjs.extend(jalaliday);
//
// interface CheckFormProps {
//     clients: Client[];
//     banks: BankLogo[];
//     loadingClients: boolean;
//     loadingBanks: boolean;
// }
//
// export default function CheckForm({
//                                       clients,
//                                       banks,
//                                       loadingClients,
//                                       loadingBanks,
//                                   }: CheckFormProps) {
//     const [amount, setAmount] = useState("");
//     const [fromClient, setFromClient] = useState("");
//     const [toClient, setToClient] = useState("");
//     const [checkNumber, setCheckNumber] = useState("");
//     const [bank, setBank] = useState("");
//     const [receiveDate, setReceiveDate] = useState("");
//     const [dueDate, setDueDate] = useState("");
//     const [state, setState] = useState("None");
//     const [description, setDescription] = useState("");
//     const [tags, setTags] = useState("");
//     const [attachment, setAttachment] = useState<File | null>(null);
//     const [saving, setSaving] = useState(false);
//     const { businessId } = useParams();
//
//     const handleSave = async () => {
//         try {
//             setSaving(true);
//             const payload: AddCheckPayload = {
//                 amount: Number(amount || 0),
//                 checkNumber,
//                 bank,
//                 receiveDate: receiveDate || new Date().toISOString(),
//                 dueDate: dueDate || new Date().toISOString(),
//                 fromClient,
//                 toClient,
//                 state,
//                 description,
//                 tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
//             };
//             await createCheck(businessId, payload);
//
//             // reset
//             setAmount("");
//             setCheckNumber("");
//             setBank("");
//             setReceiveDate("");
//             setDueDate("");
//             setState("None");
//             setDescription("");
//             setTags("");
//             setFromClient("");
//             setToClient("");
//             setAttachment(null);
//         } catch (err) {
//             console.error("failed to create check transaction", err);
//         } finally {
//             setSaving(false);
//         }
//     };
//
//     return (
//         <div className="grid gap-3">
//             <Input label="مبلغ" value={amount} onChange={(e) => setAmount(e.target.value)} />
//
//             <Select
//                 label="از مشتری"
//                 value={fromClient}
//                 onChange={setFromClient}
//                 placeholder={loadingClients ? "در حال بارگذاری..." : "انتخاب کنید"}
//                 options={clients.map((c) => ({ value: c.id, label: c.fullname }))}
//             />
//
//             <Select
//                 label="به مشتری"
//                 value={toClient}
//                 onChange={setToClient}
//                 placeholder={loadingClients ? "در حال بارگذاری..." : "انتخاب کنید"}
//                 options={clients.map((c) => ({ value: c.id, label: c.fullname }))}
//             />
//
//             <Input label="شماره چک" value={checkNumber} onChange={(e) => setCheckNumber(e.target.value)} />
//
//             {/* بانک */}
//             <Select
//                 label="بانک"
//                 value={bank}
//                 onChange={setBank}
//                 placeholder={loadingBanks ? "در حال بارگذاری..." : "انتخاب کنید"}
//                 options={banks.map((b) => ({
//                     value: b.name,
//                     label: b.name,
//                     icon: b.url,
//                 }))}
//             />
//
//             {/* تاریخ دریافت */}
//             <div className="field">
//                 <label className="label">تاریخ دریافت</label>
//                 <DatePicker
//                     calendar={persian}
//                     locale={persian_fa}
//                     value={receiveDate ? dayjs(receiveDate).calendar("jalali").toDate() : null}
//                     onChange={(date) =>
//                         setReceiveDate(date ? dayjs(date.toDate()).toISOString() : "")
//                     }
//                     className="w-full border rounded-md px-3 py-2"
//                 />
//             </div>
//
//             {/* تاریخ سررسید */}
//             <div className="field">
//                 <label className="label">تاریخ سررسید</label>
//                 <DatePicker
//                     calendar={persian}
//                     locale={persian_fa}
//                     value={dueDate ? dayjs(dueDate).calendar("jalali").toDate() : null}
//                     onChange={(date) =>
//                         setDueDate(date ? dayjs(date.toDate()).toISOString() : "")
//                     }
//                     className="w-full border rounded-md px-3 py-2"
//                 />
//             </div>
//
//             {/* وضعیت چک */}
//             <Select
//                 label="وضعیت"
//                 value={state}
//                 onChange={(val) => {
//                     const map: Record<string, string> = {
//                         "پاسی": "Pending",
//                         "پاس": "Completed",
//                         "برگشتی": "Returned",
//                         "خرج شده": "Used",
//                         "نقدی": "Cash",
//                     };
//                     setState(map[val] || "None");
//                 }}
//                 options={[
//                     { value: "پاسی", label: "پاسی" },
//                     { value: "پاس", label: "پاس" },
//                     { value: "برگشتی", label: "برگشتی" },
//                     { value: "خرج شده", label: "خرج شده" },
//                     { value: "نقدی", label: "نقدی" },
//                 ]}
//             />
//
//             <Input label="توضیحات" value={description} onChange={(e) => setDescription(e.target.value)} />
//             <Input label="تگ‌ها (با کاما جدا کنید)" value={tags} onChange={(e) => setTags(e.target.value)} />
//
//             {/* تصویر چک */}
//             <div className="field">
//                 <label className="label">تصویر چک</label>
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
