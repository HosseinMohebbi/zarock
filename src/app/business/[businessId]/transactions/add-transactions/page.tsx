// page.tsx
'use client'
import { useEffect, useState } from "react";
import Input from "@/app/components/ui/Input";
import { getAllClients, Client } from "@/services/client";
import { createCash } from "@/services/transaction";
import type { AddCashPayload } from "@/services/transaction";
import {useParams} from "next/navigation";

type Mode = "cash" | "check";

export default function TransactionForm() {
    const [mode, setMode] = useState<Mode>("cash");

    // shared fields
    const [amount, setAmount] = useState<string>("");
    const [fromClient, setFromClient] = useState<string>("");
    const [toClient, setToClient] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [tags, setTags] = useState<string>("");

    // cash-specific
    const [trackingCode, setTrackingCode] = useState<string>("");
    const [cashDate, setCashDate] = useState<string>("");

    // check-specific
    const [checkNumber, setCheckNumber] = useState<string>("");
    const [bank, setBank] = useState<string>("");
    const [receiveDate, setReceiveDate] = useState<string>("");
    const [dueDate, setDueDate] = useState<string>("");
    const [state, setState] = useState<string>("None");

    const [clients, setClients] = useState<Client[]>([]);
    const [loadingClients, setLoadingClients] = useState(false);
    const [saving, setSaving] = useState(false);

    // NOTE: Replace this placeholder with the actual business id from your app/context
    // const businessId = "PLACEHOLDER_BUSINESS_ID";
    const {businessId} = useParams();

    useEffect(() => {
        // load clients for the selects
        const load = async () => {
            try {
                setLoadingClients(true);
                // adjust page/pageSize as needed
                const data = await getAllClients({ page: 1, pageSize: 200 }, businessId);
                setClients(data);
                console.log("clients:", data);
            } catch (err) {
                console.error("failed to load clients", err);
            } finally {
                setLoadingClients(false);
            }
        };
        load();
    }, [businessId]);

    const resetSpecific = (m: Mode) => {
        if (m === "cash") {
            // clear check-only fields
            setCheckNumber("");
            setBank("");
            setReceiveDate("");
            setDueDate("");
            setState("None");
        } else {
            // clear cash-only fields
            setTrackingCode("");
            setCashDate("");
        }
    };

    const handleModeChange = (m: Mode) => {
        setMode(m);
        resetSpecific(m);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            if (mode === "cash") {
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
                // optionally reset form or show success toast
                // reset fields
                setAmount("");
                setFromClient("");
                setToClient("");
                setDescription("");
                setTags("");
                setTrackingCode("");
                setCashDate("");
                // TODO: show success notification
            } else {
                // If you also want to create checks, handle createCheck call here.
                // Not implemented in this snippet as the request was for cash creation.
            }
        } catch (err) {
            console.error("failed to create cash transaction", err);
            // TODO: show error notification
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="mode-switch">
                <button onClick={() => handleModeChange("cash")} disabled={mode === "cash"}>نقد</button>
                <button onClick={() => handleModeChange("check")} disabled={mode === "check"}>چک</button>
            </div>

            <div className="form-grid">
                <Input label="مبلغ" value={amount} onChange={(e) => setAmount(e.target.value)} />

                {/* fromClient select */}
                <div className="field">
                    <label className="label">از مشتری</label>
                    <div>
                        <select
                            value={fromClient}
                            onChange={(e) => setFromClient(e.target.value)}
                            disabled={loadingClients}
                            className="select"
                        >
                            <option value="">انتخاب کنید</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.fullname ?? c.createdAt /* fallback if fullname unavailable */}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* toClient select */}
                <div className="field">
                    <label className="label">به مشتری</label>
                    <div>
                        <select
                            value={toClient}
                            onChange={(e) => setToClient(e.target.value)}
                            disabled={loadingClients}
                            className="select"
                        >
                            <option value="">انتخاب کنید</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.fullname ?? c.createdAt}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <Input label="توضیحات" value={description} onChange={(e) => setDescription(e.target.value)} />
                <Input label="تگ‌ها (با کاما جدا کنید)" value={tags} onChange={(e) => setTags(e.target.value)} />

                {mode === "cash" && (
                    <>
                        <Input label="کد پیگیری" value={trackingCode} onChange={(e) => setTrackingCode(e.target.value)} />
                        <Input label="تاریخ" type="date" value={cashDate} onChange={(e) => setCashDate(e.target.value)} />
                    </>
                )}

                {mode === "check" && (
                    <>
                        <Input label="شماره چک" value={checkNumber} onChange={(e) => setCheckNumber(e.target.value)} />
                        <Input label="بانک" value={bank} onChange={(e) => setBank(e.target.value)} />
                        <Input label="تاریخ دریافت" type="date" value={receiveDate} onChange={(e) => setReceiveDate(e.target.value)} />
                        <Input label="تاریخ سررسید" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                        <Input label="وضعیت" value={state} onChange={(e) => setState(e.target.value)} />
                    </>
                )}

                <div className="actions">
                    <button onClick={handleSave} disabled={saving}>
                        {saving ? "در حال ذخیره..." : "ذخیره"}
                    </button>
                </div>
            </div>
        </div>
    );
}
// 'use client'
// import { useState } from "react";
// import Input from "@/app/components/ui/Input";
//
// type Mode = "cash" | "check";
//
// export default function TransactionForm() {
//     const [mode, setMode] = useState<Mode>("cash");
//
//     // shared fields
//     const [amount, setAmount] = useState<string>("");
//     const [fromClient, setFromClient] = useState<string>("");
//     const [toClient, setToClient] = useState<string>("");
//     const [description, setDescription] = useState<string>("");
//     const [tags, setTags] = useState<string>("");
//
//     // cash-specific
//     const [trackingCode, setTrackingCode] = useState<string>("");
//     const [cashDate, setCashDate] = useState<string>("");
//
//     // check-specific
//     const [checkNumber, setCheckNumber] = useState<string>("");
//     const [bank, setBank] = useState<string>("");
//     const [receiveDate, setReceiveDate] = useState<string>("");
//     const [dueDate, setDueDate] = useState<string>("");
//     const [state, setState] = useState<string>("None");
//
//     const resetSpecific = (m: Mode) => {
//         if (m === "cash") {
//             // clear check-only fields
//             setCheckNumber("");
//             setBank("");
//             setReceiveDate("");
//             setDueDate("");
//             setState("None");
//         } else {
//             // clear cash-only fields
//             setTrackingCode("");
//             setCashDate("");
//         }
//     };
//
//     const handleModeSwitch = (m: Mode) => {
//         setMode(m);
//         resetSpecific(m);
//     };
//
//     const validateCommon = () => {
//         if (!amount || Number(amount) <= 0) {
//             alert("لطفاً مقدار (amount) را به‌درستی وارد کنید.");
//             return false;
//         }
//         if (!fromClient || !toClient) {
//             alert("لطفاً گیرنده و فرستنده را وارد کنید.");
//             return false;
//         }
//         return true;
//     };
//
//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!validateCommon()) return;
//
//         const tagList = tags
//             .split(",")
//             .map((t) => t.trim())
//             .filter(Boolean);
//
//         if (mode === "cash") {
//             if (!cashDate) {
//                 alert("لطفاً تاریخ نقد را وارد کنید.");
//                 return;
//             }
//             const payload = {
//                 trackingCode: trackingCode || undefined,
//                 amount: Number(amount),
//                 date: cashDate,
//                 fromClient,
//                 toClient,
//                 description,
//                 tags: tagList,
//             };
//             console.log("Cash payload:", payload);
//             // TODO: ارسال به API -> مثال: await transactionService.addCash(payload)
//         } else {
//             // check
//             if (!checkNumber || !bank || !receiveDate || !dueDate) {
//                 alert("لطفاً همه فیلدهای چک را پر کنید.");
//                 return;
//             }
//             const payload = {
//                 amount: Number(amount),
//                 checkNumber,
//                 bank,
//                 receiveDate,
//                 dueDate,
//                 fromClient,
//                 toClient,
//                 state,
//                 description,
//                 tags: tagList,
//             };
//             console.log("Check payload:", payload);
//             // TODO: ارسال به API -> مثال: await transactionService.addCheck(payload)
//         }
//     };
//
//     return (
//         <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-4">
//             <div className="flex gap-2">
//                 <button
//                     type="button"
//                     onClick={() => handleModeSwitch("cash")}
//                     className={`px-4 py-2 rounded-lg ${
//                         mode === "cash" ? "bg-primary text-white" : "bg-surface"
//                     }`}
//                 >
//                     نقد
//                 </button>
//                 <button
//                     type="button"
//                     onClick={() => handleModeSwitch("check")}
//                     className={`px-4 py-2 rounded-lg ${
//                         mode === "check" ? "bg-primary text-white" : "bg-surface"
//                     }`}
//                 >
//                     چک
//                 </button>
//             </div>
//
//             {/* common fields */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input
//                     label="مبلغ"
//                     name="amount"
//                     type="number"
//                     value={amount}
//                     onChange={(e) => setAmount(e.target.value)}
//                     inputClass="dir-rtl"
//                 />
//                 <Input
//                     label="از (fromClient)"
//                     name="fromClient"
//                     value={fromClient}
//                     onChange={(e) => setFromClient(e.target.value)}
//                 />
//                 <Input
//                     label="به (toClient)"
//                     name="toClient"
//                     value={toClient}
//                     onChange={(e) => setToClient(e.target.value)}
//                 />
//             </div>
//
//             {/* conditional */}
//             {mode === "cash" ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <Input
//                         label="کد رهگیری"
//                         name="trackingCode"
//                         value={trackingCode}
//                         onChange={(e) => setTrackingCode(e.target.value)}
//                     />
//                     <Input
//                         label="تاریخ"
//                         name="cashDate"
//                         type="date"
//                         value={cashDate}
//                         onChange={(e) => setCashDate(e.target.value)}
//                     />
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <Input
//                         label="شماره چک"
//                         name="checkNumber"
//                         value={checkNumber}
//                         onChange={(e) => setCheckNumber(e.target.value)}
//                     />
//                     <Input
//                         label="بانک"
//                         name="bank"
//                         value={bank}
//                         onChange={(e) => setBank(e.target.value)}
//                     />
//                     <Input
//                         label="تاریخ دریافت"
//                         name="receiveDate"
//                         type="date"
//                         value={receiveDate}
//                         onChange={(e) => setReceiveDate(e.target.value)}
//                     />
//                     <Input
//                         label="تاریخ سررسید"
//                         name="dueDate"
//                         type="date"
//                         value={dueDate}
//                         onChange={(e) => setDueDate(e.target.value)}
//                     />
//                     <div className="col-span-1 md:col-span-2">
//                         <label className="!mb-1 text-sm text-foreground font-medium">وضعیت</label>
//                         <select
//                             value={state}
//                             onChange={(e) => setState(e.target.value)}
//                             className="w-full px-3 py-2 rounded-lg outline-2 outline-border"
//                         >
//                             <option value="None">None</option>
//                             <option value="Pending">Pending</option>
//                             <option value="Completed">Completed</option>
//                             <option value="Canceled">Canceled</option>
//                         </select>
//                     </div>
//                 </div>
//             )}
//
//             <div>
//                 <label className="!mb-1 text-sm text-foreground font-medium">توضیحات</label>
//                 <textarea
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     className="w-full px-3 py-2 rounded-lg outline-2 outline-border"
//                     rows={3}
//                 />
//             </div>
//
//             <Input
//                 label="تگ‌ها (با کاما جدا کنید)"
//                 name="tags"
//                 value={tags}
//                 onChange={(e) => setTags(e.target.value)}
//             />
//
//             <div className="flex justify-end">
//                 <button
//                     type="submit"
//                     className="px-4 py-2 rounded-lg bg-primary text-white"
//                 >
//                     ذخیره
//                 </button>
//             </div>
//         </form>
//     );
// }