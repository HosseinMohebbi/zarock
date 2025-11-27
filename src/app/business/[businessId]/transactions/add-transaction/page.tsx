'use client';
import { useState, useEffect } from "react";
import {filterClients, getAllClients, getBankLogos} from "@/services/client/client.service";
import { Client, BankLogo } from "@/services/client/client.types";
import CashForm from "./CashForm";
import CheckForm from "./CheckForm";
import { useParams } from "next/navigation";
import Button from "@/app/components/ui/Button";

export default function AddTransactionPage() {
    const [mode, setMode] = useState<"cash" | "check">("cash");
    const [clients, setClients] = useState<Client[]>([]);
    const [banks, setBanks] = useState<BankLogo[]>([]);
    const [loadingClients, setLoadingClients] = useState(false);
    const [loadingBanks, setLoadingBanks] = useState(false);
    const { businessId } = useParams();

    useEffect(() => {
        const loadClients = async () => {
            setLoadingClients(true);
            try {
                const data = await getAllClients({ page: 1, pageSize: 200 }, businessId);
                console.log(data);
                setClients(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingClients(false);
            }
        };
        const loadBanks = async () => {
            setLoadingBanks(true);
            try {
                const data = await getBankLogos();
                setBanks(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingBanks(false);
            }
        };
        loadClients();
        loadBanks();
    }, [businessId]);

    return (
        <div className="!pt-24">
            {/* تب‌ها */}
            <div className="flex justify-center gap-3 !mb-6">
                <Button
                    type="button"
                    label="نقد"
                    onClick={() => setMode("cash")}
                    customStyle={`!px-4 !py-2 !rounded-md text-sm font-medium border transition
                    ${mode === "cash"
                        ? '!bg-primary !text-primary-foreground'
                        : '!bg-muted !text-muted-foreground'}`}
                />

                <Button
                    type="button"
                    label="چک"
                    onClick={() => setMode("check")}
                    customStyle={`!px-4 !py-2 !rounded-md text-sm font-medium border transition
                    ${mode === "check"
                        ? '!bg-primary !text-primary-foreground'
                        : '!bg-muted !text-muted-foreground'}`}
                />
            </div>

            {/* نمایش فرم‌ها */}
            {mode === "cash" ? (
                <CashForm clients={clients} loadingClients={loadingClients} />
            ) : (
                <CheckForm clients={clients} loadingClients={loadingClients} banks={banks} loadingBanks={loadingBanks} />
            )}
        </div>
    );
}

// 'use client';
// import { useEffect, useState } from "react";
// import Input from "@/app/components/ui/Input";
// import Select from "@/app/components/ui/SelectInput";
// import { getAllClients, Client, getBankLogos, BankLogo } from "@/services/client";
// import { createCash, createCheck } from "@/services/transaction";
// import type { AddCashPayload, AddCheckPayload } from "@/services/transaction";
// import { useParams } from "next/navigation";
// import DatePicker from "react-multi-date-picker";
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";
// import dayjs from "dayjs";
// import jalaliday from "jalaliday";
// dayjs.extend(jalaliday);
//
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
//     const [attachment, setAttachment] = useState<File | null>(null);
//
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
//     const [clients, setClients] = useState<Client[]>([]);
//     const [banks, setBanks] = useState<BankLogo[]>([]);
//     const [loadingClients, setLoadingClients] = useState(false);
//     const [loadingBanks, setLoadingBanks] = useState(false);
//     const [saving, setSaving] = useState(false);
//
//     const { businessId } = useParams();
//
//     useEffect(() => {
//         // load clients for selects
//         const loadClients = async () => {
//             try {
//                 setLoadingClients(true);
//                 const data = await getAllClients({ page: 1, pageSize: 200 }, businessId);
//                 setClients(data);
//             } catch (err) {
//                 console.error("failed to load clients", err);
//             } finally {
//                 setLoadingClients(false);
//             }
//         };
//         loadClients();
//     }, [businessId]);
//
//     useEffect(() => {
//         // load banks
//         const loadBanks = async () => {
//             try {
//                 setLoadingBanks(true);
//                 const data = await getBankLogos();
//                 setBanks(data);
//             } catch (err) {
//                 console.error("failed to load bank logos", err);
//             } finally {
//                 setLoadingBanks(false);
//             }
//         };
//         loadBanks();
//     }, []);
//
//     const resetSpecific = (m: Mode) => {
//         if (m === "cash") {
//             setCheckNumber("");
//             setBank("");
//             setReceiveDate("");
//             setDueDate("");
//             setState("None");
//         } else {
//             setTrackingCode("");
//             setCashDate("");
//         }
//     };
//
//     const handleModeChange = (m: Mode) => {
//         setMode(m);
//         resetSpecific(m);
//     };
//
//     const handleSave = async () => {
//         try {
//             setSaving(true);
//             if (mode === "cash") {
//                 const payload: AddCashPayload = {
//                     trackingCode,
//                     amount: Number(amount || 0),
//                     date: cashDate || new Date().toISOString(),
//                     fromClient,
//                     toClient,
//                     description,
//                     tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
//                 };
//                 await createCash(businessId, payload);
//                 setAmount("");
//                 setFromClient("");
//                 setToClient("");
//                 setDescription("");
//                 setTags("");
//                 setTrackingCode("");
//                 setCashDate("");
//             } else if (mode === "check") {
//                 const payload: AddCheckPayload = {
//                     amount: Number(amount || 0),
//                     checkNumber,
//                     bank,
//                     receiveDate: receiveDate || new Date().toISOString(),
//                     dueDate: dueDate || new Date().toISOString(),
//                     fromClient,
//                     toClient,
//                     state,
//                     description,
//                     tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
//                 };
//                 await createCheck(businessId, payload);
//                 setAmount("");
//                 setFromClient("");
//                 setToClient("");
//                 setDescription("");
//                 setTags("");
//                 setCheckNumber("");
//                 setBank("");
//                 setReceiveDate("");
//                 setDueDate("");
//                 setState("None");
//             }
//         } catch (err) {
//             console.error("failed to create transaction", err);
//         } finally {
//             setSaving(false);
//         }
//     };
//
//     return (
//         <div>
//             <div className="mode-switch flex gap-2 mb-4">
//                 <button
//                     onClick={() => handleModeChange("cash")}
//                     disabled={mode === "cash"}
//                     className="px-4 py-2 border rounded-md"
//                 >
//                     نقد
//                 </button>
//                 <button
//                     onClick={() => handleModeChange("check")}
//                     disabled={mode === "check"}
//                     className="px-4 py-2 border rounded-md"
//                 >
//                     چک
//                 </button>
//             </div>
//
//             <div className="form-grid grid gap-3">
//                 <Input label="مبلغ" value={amount} onChange={(e) => setAmount(e.target.value)} />
//
//                 {/* fromClient select */}
//                 <div className="field">
//                     <Select
//                         label="از مشتری"
//                         value={fromClient}
//                         onChange={setFromClient}
//                         placeholder={loadingClients ? "در حال بارگذاری..." : "انتخاب کنید"}
//                         options={clients.map(c => ({
//                             value: c.id,
//                             label: c.fullname ?? c.createdAt,
//                         }))}
//                     />
//                 </div>
//
//                 {/* toClient select */}
//                 <div className="field">
//                     <label className="label">به مشتری</label>
//                     <Select
//                         label="به مشتری"
//                         value={toClient}
//                         onChange={setToClient}
//                         placeholder={loadingClients ? "در حال بارگذاری..." : "انتخاب کنید"}
//                         options={clients.map(c => ({
//                             value: c.id,
//                             label: c.fullname ?? c.createdAt,
//                         }))}
//                     />
//                 </div>
//
//                 {mode === "cash" && (
//                     <>
//                         <Input label="کد پیگیری" value={trackingCode} onChange={(e) => setTrackingCode(e.target.value)} />
//                         <div className="field">
//                             <label className="label">تاریخ</label>
//                             <DatePicker
//                                 calendar={persian}
//                                 locale={persian_fa}
//                                 value={cashDate ? dayjs(cashDate).calendar("jalali").toDate() : null}
//                                 onChange={(date) =>
//                                     setCashDate(date ? dayjs(date.toDate()).toISOString() : "")
//                                 }
//                                 className="w-full border rounded-md px-3 py-2"
//                             />
//                         </div>
//                         {/*<Input label="تاریخ" type="date" value={cashDate} onChange={(e) => setCashDate(e.target.value)} />*/}
//                     </>
//                 )}
//
//                 <Input label="توضیحات" value={description} onChange={(e) => setDescription(e.target.value)} />
//                 <Input label="تگ‌ها (با کاما جدا کنید)" value={tags} onChange={(e) => setTags(e.target.value)} />
//
//                 {mode === "check" && (
//                     <>
//                         <Input label="شماره چک" value={checkNumber} onChange={(e) => setCheckNumber(e.target.value)} />
//
//                         {/* ✅ بانک به‌صورت Select با آیکون */}
//                         <Select
//                             label="بانک"
//                             value={bank}
//                             onChange={setBank}
//                             placeholder={loadingBanks ? "در حال بارگذاری..." : "انتخاب کنید"}
//                             options={banks.map((b) => ({
//                                 value: b.name,
//                                 label: b.name,
//                                 icon: b.url,
//                             }))}
//                         />
//
//                         <div className="field">
//                             <label className="label">تاریخ دریافت</label>
//                             <DatePicker
//                                 calendar={persian}
//                                 locale={persian_fa}
//                                 value={receiveDate ? dayjs(receiveDate).calendar("jalali").toDate() : null}
//                                 onChange={(date) =>
//                                     setReceiveDate(date ? dayjs(date.toDate()).toISOString() : "")
//                                 }
//                                 className="w-full border rounded-md px-3 py-2"
//                             />
//                         </div>
//
//                         <div className="field">
//                             <label className="label">تاریخ سررسید</label>
//                             <DatePicker
//                                 calendar={persian}
//                                 locale={persian_fa}
//                                 value={dueDate ? dayjs(dueDate).calendar("jalali").toDate() : null}
//                                 onChange={(date) =>
//                                     setDueDate(date ? dayjs(date.toDate()).toISOString() : "")
//                                 }
//                                 className="w-full border rounded-md px-3 py-2"
//                             />
//                         </div>
//
//                         <Select
//                             label="وضعیت"
//                             value={state}
//                             onChange={(val) => {
//                                 // فارسی → انگلیسی
//                                 const map: Record<string, string> = {
//                                     "پاسی": "Pending",
//                                     "پاس": "Completed",
//                                     "برگشتی": "Returned",
//                                     "خرج شده": "Used",
//                                     "نقدی": "Cash",
//                                 };
//                                 setState(map[val] || "None");
//                             }}
//                             options={[
//                                 { value: "پاسی", label: "پاسی" },
//                                 { value: "پاس", label: "پاس" },
//                                 { value: "برگشتی", label: "برگشتی" },
//                                 { value: "خرج شده", label: "خرج شده" },
//                                 { value: "نقدی", label: "نقدی" },
//                             ]}
//                         />
//
//                         <div className="field">
//                             <label className="label">تصویر چک / رسید</label>
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={(e) => setAttachment(e.target.files?.[0] || null)}
//                                 className="block w-full border rounded-md p-2 text-sm"
//                             />
//                             {attachment && (
//                                 <p className="text-xs text-gray-500 mt-1">
//                                     فایل انتخاب‌شده: {attachment.name}
//                                 </p>
//                             )}
//                         </div>
//                     </>
//                 )}
//
//                 <div className="actions mt-4">
//                     <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-indigo-600 text-white rounded-md">
//                         {saving ? "در حال ذخیره..." : "ذخیره"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }