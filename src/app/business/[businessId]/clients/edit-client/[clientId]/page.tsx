// src/app/.../EditClient.tsx
'use client';

import {useState} from "react";
import {useParams} from "next/navigation";
import ClientInfoForm from "./ClientInfoForm";
import ClientBankAccountsForm from "./ClientBankAccountsForm";
import Button from "@/app/components/ui/Button";

export default function EditClient() {
    const params = useParams() as { businessId?: string; clientId?: string };
    const businessId = params.businessId ?? '';
    const clientId = params.clientId ?? '';

    const [activeTab, setActiveTab] = useState<'info' | 'bank'>('info');
    console.log(activeTab);

    if (!businessId || !clientId) {
        return (
            <div className="flex justify-center items-center h-screen">
                شناسه کسب‌وکار یا مشتری نامعتبر است
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center !px-4 !py-6">
            <div className="w-full max-w-2xl mx-auto">
                {/* تب‌ها */}
                <div className="flex justify-center gap-3 !mb-6">
                    <Button
                        type="button"
                        label="اطلاعات کاربر"
                        onClick={() => setActiveTab('info')}
                        customStyle={`!px-4 !py-2 !rounded-md text-sm font-medium border transition
                        ${activeTab === 'info'
                            ? '!bg-primary !text-primary-foreground'
                            : '!bg-muted !text-muted-foreground'}`}
                    />

                    <Button
                        type="button"
                        label="حساب‌های بانکی"
                        onClick={() => setActiveTab('bank')}
                        customStyle={`!px-4 !py-2 !rounded-md text-sm font-medium border transition
                        ${activeTab === 'bank'
                            ? '!bg-primary !text-primary-foreground'
                            : '!bg-muted !text-muted-foreground'}`}
                    />
                </div>

                {/* هر دو کامپوننت mount هستند، فقط یکی مخفی می‌شود */}
                {/*<div className="w-full flex justify-center">*/}
                    <div className={activeTab === 'info' ? 'block' : 'hidden'}>
                        <ClientInfoForm businessId={businessId} clientId={clientId}/>
                    </div>

                    <div className={activeTab === 'bank' ? 'block' : 'hidden'}>
                        <ClientBankAccountsForm businessId={businessId} clientId={clientId}/>
                    </div>
                {/*</div>*/}
            </div>
        </div>
    );
}

// 'use client';
// import {useEffect, useState} from "react";
// import {useParams, useRouter} from 'next/navigation';
// import Input from "@/app/components/ui/Input";
// import Button from "@/app/components/ui/Button";
// import Card from "@/app/components/ui/Card";
// import {
//     BankLogo,
//     Client,
//     getBankLogos,
//     createBankAccount,
//     updateClient,
//     updateBankAccount,
//     getBankAccounts
// } from "@/services/client";
// import {http} from "@/utils/api/http";
// import {BankAccountModal} from "@/app/components/ui/modals/BankAccountModal";
// import {MdAdd} from "react-icons/md";
// import {toast} from "react-toastify";
//
// interface BankAccountResponse {
//     id: string;
//     bankName?: string;
//     accountNumber?: string;
//     cardNumber?: string;
//     shaBaCode?: string;
// }
//
// export default function EditClient() {
//     const [fullName, setFullName] = useState('');
//     const [nationalCode, setNationalCode] = useState('');
//     const [address, setAddress] = useState('');
//     const [invoiceDescription, setInvoiceDescription] = useState('');
//     const [isJuridicalPerson, setIsJuridicalPerson] = useState(true);
//     const [isOwnerMember, setIsOwnerMember] = useState(false);
//
//     const [logos, setLogos] = useState<BankLogo[]>([]);
//     const [selectedBank, setSelectedBank] = useState<BankLogo | null>(null);
//
//     const [bankAccounts, setBankAccounts] = useState<BankAccountResponse[]>([]);
//     const [accountsLoading, setAccountsLoading] = useState(true);
//     const [accountsError, setAccountsError] = useState<string | null>(null);
//
//     const [editingAccount, setEditingAccount] = useState<BankAccountResponse | null>(null);
//     const [modalOpen, setModalOpen] = useState(false);
//
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [success, setSuccess] = useState<string | null>(null);
//
//     const params = useParams() as { businessId?: string; clientId?: string };
//     const businessId = params.businessId ?? '';
//     const clientId = params.clientId ?? '';
//     const router = useRouter();
//
//     // load client + logos + bank accounts
//     useEffect(() => {
//         async function loadClient() {
//             if (!businessId || !clientId) {
//                 setError('شناسه کسب‌وکار یا مشتری نامعتبر است');
//                 setAccountsError('شناسه کسب‌وکار یا مشتری نامعتبر است');
//                 setAccountsLoading(false);
//                 setLoading(false);
//                 return;
//             }
//
//             try {
//                 setLoading(true);
//                 setAccountsLoading(true);
//
//                 const {data} = await http.get<Client>(`/api/client/${businessId}/${clientId}`);
//                 const _logos = await getBankLogos();
//                 setLogos(_logos);
//
//                 // load bank accounts
//                 try {
//                     const accounts = await getBankAccounts(businessId, clientId);
//                     setBankAccounts(accounts ?? []);
//                     setAccountsError(null);
//
//                     if (accounts && accounts.length > 0 && _logos.length > 0) {
//                         const firstBankName = accounts[0].bankName?.toLowerCase() ?? '';
//                         const matched = _logos.find(l => l.name?.toLowerCase() === firstBankName);
//                         if (matched) setSelectedBank(matched);
//                     }
//                 } catch (accErr: any) {
//                     console.error('Failed to load bank accounts:', accErr);
//                     setBankAccounts([]);
//                     setAccountsError(accErr?.message ?? 'خطا در دریافت حساب‌های بانکی');
//                 }
//
//                 setFullName(data.fullname);
//                 setNationalCode(data.nationalCode);
//                 setAddress(data.address);
//                 setInvoiceDescription(data.constantDescriptionInvoice);
//                 setIsJuridicalPerson(data.isJuridicalPerson);
//                 setIsOwnerMember(data.isOwnerClient);
//                 setError(null);
//             } catch (err: any) {
//                 console.error('Failed to load client:', err);
//                 setError(err?.message ?? 'خطا در بارگذاری اطلاعات مشتری');
//                 if (err?.response?.status === 401) {
//                     router.push('/login');
//                 }
//             } finally {
//                 setLoading(false);
//                 setAccountsLoading(false);
//             }
//         }
//
//         loadClient();
//     }, [businessId, clientId, router]);
//
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError(null);
//         setSuccess(null);
//         setLoading(true);
//
//         try {
//             await updateClient(businessId, clientId, {
//                 fullName,
//                 nationalCode,
//                 address,
//                 constantDescriptionInvoice: invoiceDescription,
//                 isJuridicalPerson,
//                 isOwnerMember,
//                 tags: [],
//             });
//             setSuccess("اطلاعات مشتری با موفقیت به‌روزرسانی شد");
//             router.push(`/business/${businessId}/clients`);
//         } catch (err: any) {
//             console.error("Failed to update client:", err);
//             setError(err?.message ?? "خطا در به‌روزرسانی اطلاعات مشتری");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     async function loadBankAccounts() {
//         try {
//             setAccountsLoading(true);
//             const accounts = await getBankAccounts(businessId, clientId);
//             setBankAccounts(accounts ?? []);
//             setAccountsError(null);
//         } catch (err: any) {
//             console.error("Failed to reload accounts:", err);
//             setAccountsError("خطا در دریافت حساب‌های بانکی");
//         } finally {
//             setAccountsLoading(false);
//         }
//     }
//
//     function handleAddNewAccount() {
//         setEditingAccount(null);
//         setModalOpen(true);
//     }
//
//     function handleEditAccount(account: BankAccountResponse) {
//         setEditingAccount(account);
//         setModalOpen(true);
//     }
//
//     async function handleModalSubmit(data: {
//         selectedBank: BankLogo;
//         accountNumber: string;
//         cardNumber: string;
//         shaBaCode: string;
//     }) {
//         if (!data.selectedBank) return;
//
//         setLoading(true);
//         setError(null);
//         setSuccess(null);
//
//         try {
//             if (editingAccount) {
//                 await updateBankAccount(businessId, editingAccount.id, {
//                     bankName: data.selectedBank.name,
//                     accountNumber: data.accountNumber,
//                     cardNumber: data.cardNumber,
//                     shaBaCode: data.shaBaCode,
//                 });
//                 toast.success("حساب بانکی با موفقیت ویرایش شد");
//             } else {
//                 await createBankAccount(businessId, clientId, {
//                     bankName: data.selectedBank.name,
//                     accountNumber: data.accountNumber,
//                     cardNumber: data.cardNumber,
//                     shaBaCode: data.shaBaCode,
//                 });
//                 setSuccess("حساب بانکی با موفقیت اضافه شد");
//             }
//             await loadBankAccounts();
//         } catch (err: any) {
//             console.error(err);
//             setError(err?.message ?? "خطا در عملیات حساب بانکی");
//         } finally {
//             setLoading(false);
//             setModalOpen(false);
//         }
//     }
//
//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 در حال بارگذاری...
//             </div>
//         );
//     }
//
//     return (
//         <div className="w-full flex flex-col items-center gap-6 !px-4 !py-6">
//             {/* کارت ویرایش مشتری - استایل شبیه فرم آیتم */}
//             <div className="w-full max-w-lg mx-auto !p-6 bg-background text-foreground rounded-lg shadow">
//                 <h2 className="text-xl font-semibold !mb-4 text-center">
//                     ویرایش اطلاعات مشتری
//                 </h2>
//
//                 {success && (
//                     <div className="!mb-4 text-sm text-center">
//                         <span className="inline-block !px-3 !py-1 bg-green-100 text-green-800 rounded">
//                             {success}
//                         </span>
//                     </div>
//                 )}
//
//                 {error && (
//                     <div className="!mb-4 text-sm text-center">
//                         <span className="inline-block !px-3 !py-1 bg-red-100 text-red-800 rounded">
//                             {error}
//                         </span>
//                     </div>
//                 )}
//
//                 <form onSubmit={handleSubmit} className="flex flex-col gap-5">
//                     {/* نام کامل */}
//                     <Input
//                         label="نام کامل"
//                         name="fullName"
//                         value={fullName}
//                         onChange={(e) => setFullName(e.target.value)}
//                     />
//
//                     {/* کد ملی */}
//                     <Input
//                         label="کد ملی"
//                         name="nationalCode"
//                         value={nationalCode}
//                         onChange={(e) => setNationalCode(e.target.value)}
//                     />
//
//                     {/* آدرس */}
//                     <Input
//                         label="آدرس"
//                         name="address"
//                         value={address}
//                         onChange={(e) => setAddress(e.target.value)}
//                     />
//
//                     {/* توضیحات فاکتور */}
//                     <Input
//                         label="توضیحات فاکتور"
//                         name="invoiceDescription"
//                         value={invoiceDescription}
//                         onChange={(e) => setInvoiceDescription(e.target.value)}
//                     />
//
//                     {/* نوع شخص و عضویت */}
//                     <div className="flex flex-col gap-2">
//                         <label className="text-lg font-medium">نوع شخص</label>
//
//                         <div className="flex items-center gap-6">
//                             <label className="flex items-center gap-2">
//                                 <input
//                                     type="radio"
//                                     name="clientType"
//                                     value="juridical"
//                                     checked={isJuridicalPerson === true}
//                                     onChange={() => setIsJuridicalPerson(true)}
//                                     className="w-4 h-4 accent-primary"
//                                 />
//                                 <span>شخص حقوقی</span>
//                             </label>
//
//                             <label className="flex items-center gap-2">
//                                 <input
//                                     type="radio"
//                                     name="clientType"
//                                     value="real"
//                                     checked={isJuridicalPerson === false}
//                                     onChange={() => setIsJuridicalPerson(false)}
//                                     className="w-4 h-4 accent-primary"
//                                 />
//                                 <span>شخص حقیقی</span>
//                             </label>
//                         </div>
//
//                         <label className="flex items-center gap-2 mt-2">
//                             <input
//                                 type="checkbox"
//                                 checked={isOwnerMember}
//                                 onChange={(e) => setIsOwnerMember(e.target.checked)}
//                                 className="w-4 h-4 accent-primary"
//                             />
//                             <span>اعضای کسب و کار</span>
//                         </label>
//                     </div>
//
//                     {/* دکمه‌ها */}
//                     <div className="flex justify-end items-center gap-3 !mt-3">
//                         <Button
//                             type="button"
//                             onClick={() => router.push(`/${businessId}/clients`)}
//                             label="انصراف"
//                         />
//                         <Button
//                             type="submit"
//                             label={loading ? "در حال ویرایش..." : "ویرایش"}
//                             disabled={loading}
//                         />
//                     </div>
//                 </form>
//             </div>
//
//             {/* کارت حساب‌های بانکی - استایل منظم و هم‌خانواده */}
//             <div className="w-full max-w-2xl mx-auto !p-6 bg-background text-foreground rounded-lg shadow">
//                 <div className="flex items-center justify-between !mb-4">
//                     <h3 className="text-md font-semibold">حساب‌های بانکی</h3>
//                     <Button
//                         type="button"
//                         onClick={handleAddNewAccount}
//                         customStyle="flex items-center gap-2 !px-3 !py-2 bg-green-600 hover:bg-green-700"
//                         label={
//                             <span className="flex items-center gap-2">
//                                 <MdAdd className="w-5 h-5" />
//                                 <span>افزودن حساب جدید</span>
//                             </span>
//                         }
//                     />
//                 </div>
//
//                 {accountsLoading ? (
//                     <div className="text-sm text-zinc-600">در حال بارگذاری حساب‌ها...</div>
//                 ) : accountsError ? (
//                     <div className="text-sm text-red-600">{accountsError}</div>
//                 ) : bankAccounts.length === 0 ? (
//                     <div className="text-sm text-zinc-500">
//                         حساب بانکی ثبت نشده است.
//                     </div>
//                 ) : (
//                     <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
//                         {bankAccounts.map((acc) => {
//                             const logo = logos.find(
//                                 l => l.name?.toLowerCase() === acc.bankName?.toLowerCase()
//                             );
//                             return (
//                                 <Card
//                                     key={acc.id}
//                                     title={acc.bankName}
//                                     icon={
//                                         logo?.url ? (
//                                             <img
//                                                 src={logo.url}
//                                                 alt={logo.name}
//                                                 className="w-8 h-8 object-contain rounded-sm"
//                                             />
//                                         ) : (
//                                             <div
//                                                 className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-sm text-xs"
//                                             >
//                                                 {acc.bankName?.slice(0, 2)}
//                                             </div>
//                                         )
//                                     }
//                                 >
//                                     <div className="text-sm text-gray-700 leading-6">
//                                         <div>
//                                             شماره حساب:{' '}
//                                             <span className="font-medium">
//                                                 {acc.accountNumber || '-'}
//                                             </span>
//                                         </div>
//                                         <div>
//                                             شماره کارت:{' '}
//                                             <span className="font-medium">
//                                                 {acc.cardNumber || '-'}
//                                             </span>
//                                         </div>
//                                         <div>
//                                             شماره شبا:{' '}
//                                             <span className="font-medium">
//                                                 {acc.shaBaCode || '-'}
//                                             </span>
//                                         </div>
//                                     </div>
//                                     <div className="flex justify-end mt-3">
//                                         <button
//                                             onClick={() => handleEditAccount(acc)}
//                                             className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
//                                         >
//                                             ویرایش
//                                         </button>
//                                     </div>
//                                 </Card>
//                             );
//                         })}
//                     </div>
//                 )}
//             </div>
//
//             {/* مدال حساب بانکی */}
//             {modalOpen && (
//                 <BankAccountModal
//                     open={modalOpen}
//                     onClose={() => setModalOpen(false)}
//                     onSubmit={handleModalSubmit}
//                     editingAccount={editingAccount}
//                     logos={logos}
//                 />
//             )}
//         </div>
//     );
// }
//
// // 'use client';
// // import {useEffect, useState, useRef} from "react";
// // import {useParams, useRouter} from 'next/navigation';
// // import {cn} from "@/utils/cn";
// // import Input from "@/app/components/ui/Input";
// // import Button from "@/app/components/ui/Button";
// // import Modal from "@/app/components/ui/Modal";
// // import Card from "@/app/components/ui/Card";
// // import {
// //     BankLogo,
// //     Client,
// //     getBankLogos,
// //     createBankAccount,
// //     updateClient,
// //     updateBankAccount,
// //     getBankAccounts
// // } from "@/services/client";
// // import {http} from "@/utils/api/http";
// // import {BankAccountModal} from "@/app/components/ui/modals/BankAccountModal";
// // import {MdAdd} from "react-icons/md";
// // import {toast} from "react-toastify";
// //
// //
// // interface BankAccountResponse {
// //     id: string;
// //     bankName?: string;
// //     accountNumber?: string;
// //     cardNumber?: string;
// //     shaBaCode?: string;
// // }
// //
// // export default function EditClient() {
// //     const [fullName, setFullName] = useState('');
// //     const [nationalCode, setNationalCode] = useState('');
// //     const [address, setAddress] = useState('');
// //     const [invoiceDescription, setInvoiceDescription] = useState('');
// //     const [isJuridicalPerson, setIsJuridicalPerson] = useState(true);
// //     const [isOwnerMember, setIsOwnerMember] = useState(false);
// //
// //     const [logos, setLogos] = useState<BankLogo[]>([]);
// //     const [selectedBank, setSelectedBank] = useState<BankLogo | null>(null);
// //     const [dropdownRef, setDropdownRef] = useState<HTMLDivElement | null>(null);
// //
// //     const [bankAccounts, setBankAccounts] = useState<BankAccountResponse[]>([]);
// //     const [accountsLoading, setAccountsLoading] = useState(true);
// //     const [accountsError, setAccountsError] = useState<string | null>(null);
// //
// //     const [editingAccount, setEditingAccount] = useState<BankAccountResponse | null>(null);
// //     const [modalOpen, setModalOpen] = useState(false);
// //
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState<string | null>(null);
// //     const [success, setSuccess] = useState<string | null>(null);
// //
// //     const params = useParams() as { businessId?: string; clientId?: string };
// //     const businessId = params.businessId ?? '';
// //     const clientId = params.clientId ?? '';
// //     const router = useRouter();
// //
// //     // load client + logos + bank accounts
// //     useEffect(() => {
// //         async function loadClient() {
// //             if (!businessId || !clientId) {
// //                 setError('شناسه کسب‌وکار یا مشتری نامعتبر است');
// //                 setAccountsError('شناسه کسب‌وکار یا مشتری نامعتبر است');
// //                 setAccountsLoading(false);
// //                 setLoading(false);
// //                 return;
// //             }
// //
// //             try {
// //                 setLoading(true);
// //                 setAccountsLoading(true);
// //
// //                 const {data} = await http.get<Client>(`/api/client/${businessId}/${clientId}`);
// //                 const logos = await getBankLogos();
// //                 setLogos(logos);
// //
// //                 // load bank accounts
// //                 try {
// //                     const accounts = await getBankAccounts(businessId, clientId);
// //                     setBankAccounts(accounts ?? []);
// //                     setAccountsError(null);
// //
// //                     if (accounts && accounts.length > 0 && logos.length > 0) {
// //                         const firstBankName = accounts[0].bankName?.toLowerCase() ?? '';
// //                         const matched = logos.find(l => l.name?.toLowerCase() === firstBankName);
// //                         if (matched) setSelectedBank(matched);
// //                     }
// //                 } catch (accErr: any) {
// //                     console.error('Failed to load bank accounts:', accErr);
// //                     setBankAccounts([]);
// //                     setAccountsError(accErr?.message ?? 'خطا در دریافت حساب‌های بانکی');
// //                 }
// //
// //                 setFullName(data.fullname);
// //                 setNationalCode(data.nationalCode);
// //                 setAddress(data.address);
// //                 setInvoiceDescription(data.constantDescriptionInvoice);
// //                 setIsJuridicalPerson(data.isJuridicalPerson);
// //                 setIsOwnerMember(data.isOwnerClient);
// //                 setError(null);
// //             } catch (err: any) {
// //                 console.error('Failed to load client:', err);
// //                 setError(err?.message ?? 'خطا در بارگذاری اطلاعات مشتری');
// //                 if (err?.response?.status === 401) {
// //                     router.push('/login');
// //                 }
// //             } finally {
// //                 setLoading(false);
// //                 setAccountsLoading(false);
// //             }
// //         }
// //
// //         loadClient();
// //     }, [businessId, clientId, router]);
// //
// //     const handleSubmit = async (e: React.FormEvent) => {
// //         e.preventDefault();
// //         setError(null);
// //         setSuccess(null);
// //         setLoading(true);
// //
// //         try {
// //             await updateClient(businessId, clientId, {
// //                 fullName,
// //                 nationalCode,
// //                 address,
// //                 constantDescriptionInvoice: invoiceDescription,
// //                 isJuridicalPerson,
// //                 isOwnerMember,
// //                 tags: [],
// //             });
// //             setSuccess("اطلاعات مشتری با موفقیت به‌روزرسانی شد");
// //             router.push(`/business/${businessId}/clients`);
// //         } catch (err: any) {
// //             console.error("Failed to update client:", err);
// //             setError(err?.message ?? "خطا در به‌روزرسانی اطلاعات مشتری");
// //         } finally {
// //             setLoading(false);
// //         }
// //     };
// //
// //     async function loadBankAccounts() {
// //         try {
// //             setAccountsLoading(true);
// //             const accounts = await getBankAccounts(businessId, clientId);
// //             setBankAccounts(accounts ?? []);
// //             setAccountsError(null);
// //         } catch (err: any) {
// //             console.error("Failed to reload accounts:", err);
// //             setAccountsError("خطا در دریافت حساب‌های بانکی");
// //         } finally {
// //             setAccountsLoading(false);
// //         }
// //     }
// //
// //     function handleAddNewAccount() {
// //         setEditingAccount(null);
// //         setModalOpen(true);
// //     }
// //
// //     function handleEditAccount(account: BankAccountResponse) {
// //         setEditingAccount(account);
// //         setModalOpen(true);
// //     }
// //
// //     async function handleModalSubmit(data: {
// //         selectedBank: BankLogo;
// //         accountNumber: string;
// //         cardNumber: string;
// //         shaBaCode: string
// //     }) {
// //         if (!data.selectedBank) return;
// //
// //         setLoading(true);
// //         setError(null);
// //         setSuccess(null);
// //
// //         try {
// //             if (editingAccount) {
// //                 await updateBankAccount(businessId, editingAccount.id, {
// //                     bankName: data.selectedBank.name,
// //                     accountNumber: data.accountNumber,
// //                     cardNumber: data.cardNumber,
// //                     shaBaCode: data.shaBaCode,
// //                 });
// //                 // setSuccess("حساب بانکی با موفقیت ویرایش شد");
// //                 toast.success("حساب بانکی با موفقیت ویرایش شد");
// //             } else {
// //                 await createBankAccount(businessId, clientId, {
// //                     bankName: data.selectedBank.name,
// //                     accountNumber: data.accountNumber,
// //                     cardNumber: data.cardNumber,
// //                     shaBaCode: data.shaBaCode,
// //                 });
// //                 setSuccess("حساب بانکی با موفقیت اضافه شد");
// //             }
// //             await loadBankAccounts();
// //         } catch (err: any) {
// //             console.error(err);
// //             setError(err?.message ?? "خطا در عملیات حساب بانکی");
// //         } finally {
// //             setLoading(false);
// //             setModalOpen(false);
// //         }
// //     }
// //
// //     if (loading) {
// //         return <div className="flex justify-center items-center h-screen">در حال بارگذاری...</div>;
// //     }
// //
// //     return (
// //         <div className="w-full h-full flex flex-col items-center !py-6 px-4 lg:flex-row">
// //             <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4 space-y-4">
// //                 <h1 className="text-xl font-medium">ویرایش اطلاعات مشتری</h1>
// //                 <div className="w-full flex flex-col items-center justify-between gap-4">
// //                     <div className="w-full flex flex-col items-center justify-between gap-4">
// //                         <Input label="نام کامل" name="fullName" value={fullName} containerClass="w-[90%] max-w-lg"
// //                                onChange={(e) => setFullName(e.target.value)}/>
// //                         <Input label="کد ملی" name="nationalCode" value={nationalCode} containerClass="w-[90%] max-w-lg"
// //                                onChange={(e) => setNationalCode(e.target.value)}/>
// //                         <Input label="آدرس" name="address" value={address} containerClass="w-[90%] max-w-lg"
// //                                onChange={(e) => setAddress(e.target.value)}/>
// //                         <Input label="توضیحات فاکتور" name="invoiceDescription" value={invoiceDescription}
// //                                containerClass="w-[90%] max-w-lg"
// //                                onChange={(e) => setInvoiceDescription(e.target.value)}/>
// //                     </div>
// //                     <div className="flex flex-col justify-center items-start gap-6">
// //                         <div className="flex justify-center items-center gap-6">
// //                             <label className="flex items-center gap-2">
// //                                 <input
// //                                     type="radio"
// //                                     name="clientType"
// //                                     value="juridical"
// //                                     checked={isJuridicalPerson === true}
// //                                     onChange={() => setIsJuridicalPerson(true)}
// //                                     className="w-4 h-4"
// //                                 />
// //                                 <span>شخص حقوقی</span>
// //                             </label>
// //
// //                             <label className="flex items-center gap-2">
// //                                 <input
// //                                     type="radio"
// //                                     name="clientType"
// //                                     value="real"
// //                                     checked={isJuridicalPerson === false}
// //                                     onChange={() => setIsJuridicalPerson(false)}
// //                                     className="w-4 h-4"
// //                                 />
// //                                 <span>شخص حقیقی</span>
// //                             </label>
// //                         </div>
// //                         <label className="flex items-center gap-2">
// //                             <input type="checkbox" checked={isOwnerMember}
// //                                    onChange={(e) => setIsOwnerMember(e.target.checked)} className="w-4 h-4"/>
// //                             <span>اعضای کسب و کار</span>
// //                         </label>
// //                     </div>
// //                 </div>
// //                 <div className="flex gap-4 mt-6">
// //                     <Button type="submit" label="ویرایش" disabled={loading}
// //                             customStyle="w-32 h-1/3 bg-green-600 hover:bg-green-700"/>
// //                     <Button type="button" onClick={() => router.push(`/${businessId}/clients`)}
// //                             customStyle="bg-gray-500 hover:bg-gray-600">
// //                         انصراف
// //                     </Button>
// //                 </div>
// //
// //                 {error && <div className="text-red-600 mt-4">{error}</div>}
// //                 {/*{success && <div className="text-green-600 mt-4">{success}</div>}*/}
// //             </form>
// //             <div className="w-full flex flex-col items-center justify-between gap-4 !mt-8">
// //                 <div className="w-[80%] flex justify-between items-center">
// //                     <h3 className="text-md font-medium mt-8 mb-3">حساب‌های بانکی</h3>
// //                     <div className="mt-6">
// //                         <Button label={<MdAdd className="w-8 h-8 inline mr-1"/>} type="button"
// //                                 onClick={handleAddNewAccount}
// //                                 customStyle="bg-green-600 hover:bg-green-700">
// //                             <MdAdd className="w-8 h-8 inline mr-1"/>
// //                         </Button>
// //                     </div>
// //                 </div>
// //                 {accountsLoading ? (
// //                     <div>در حال بارگذاری حساب‌ها...</div>
// //                 ) : accountsError ? (
// //                     <div className="text-red-600">{accountsError}</div>
// //                 ) : bankAccounts.length === 0 ? (
// //                     <div className="text-sm text-zinc-500">حساب بانکی ثبت نشده است.</div>
// //                 ) : (
// //                     <div className="w-[80%] flex flex-col items-center gap-4 overflow-y-scroll">
// //                         {bankAccounts.map((acc) => {
// //                             const logo = logos.find(l => l.name?.toLowerCase() === acc.bankName?.toLowerCase());
// //                             return (
// //                                 <Card
// //                                     key={acc.id}
// //                                     title={acc.bankName}
// //                                     icon={logo?.url ? <img src={logo.url} alt={logo.name}
// //                                                            className="w-8 h-8 object-contain rounded-sm"/> : <div
// //                                         className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-sm text-xs">{acc.bankName?.slice(0, 2)}</div>}
// //                                 >
// //                                     <div className="text-sm text-gray-700 leading-6">
// //                                         <div>شماره حساب: <span className="font-medium">{acc.accountNumber}</span></div>
// //                                         <div>شماره کارت: <span className="font-medium">{acc.cardNumber}</span></div>
// //                                         <div>شماره شبا: <span className="font-medium">{acc.shaBaCode}</span></div>
// //                                     </div>
// //                                     <div className="flex justify-end mt-3">
// //                                         <button onClick={() => handleEditAccount(acc)}
// //                                                 className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700">
// //                                             ویرایش
// //                                         </button>
// //                                     </div>
// //                                 </Card>
// //                             );
// //                         })}
// //                     </div>
// //                 )}
// //             </div>
// //             {/* ---------------- مدال حساب بانکی ---------------- */}
// //             {modalOpen && (
// //                 <BankAccountModal
// //                     open={modalOpen}
// //                     onClose={() => setModalOpen(false)}
// //                     onSubmit={handleModalSubmit}
// //                     editingAccount={editingAccount}
// //                     logos={logos}
// //                 />
// //             )}
// //         </div>
// //     );
// // }
// //
