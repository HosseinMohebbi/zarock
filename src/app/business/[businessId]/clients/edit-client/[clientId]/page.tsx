// 'use client'
// import {useEffect, useState, useRef} from "react";
// import {useParams, useRouter} from 'next/navigation';
// import {cn} from "@/utils/cn";
// import Input from "@/app/components/ui/Input";
// import Button from "@/app/components/ui/Button";
// import Modal from "@/app/components/ui/Modal";
// import Card from "@/app/components/ui/Card";
// import ThemeToggle from "@/app/components/theme/ThemeToggle";
// import {BankLogo, Client, getBankLogos, createBankAccount, updateBankAccount, BankAccountResponse, getBankAccounts} from "@/services/client";
// import {http} from "@/utils/api/http";
// import {MdAdd} from "react-icons/md";
//
// export default function EditClient() {
//     const [fullName, setFullName] = useState('');
//     const [nationalCode, setNationalCode] = useState('');
//     const [address, setAddress] = useState('');
//     const [invoiceDescription, setInvoiceDescription] = useState('');
//     const [isJuridicalPerson, setIsJuridicalPerson] = useState(false);
//     const [isOwnerMember, setIsOwnerMember] = useState(false);
//
//     const [logos, setLogos] = useState<BankLogo[]>([])
//     const [selectedBank, setSelectedBank] = useState<BankLogo | null>(null);
//     const [bankDropdownOpen, setBankDropdownOpen] = useState(false);
//     const dropdownRef = useRef<HTMLDivElement | null>(null);
//     const [accountNumber, setAccountNumber] = useState('');
//     const [cardNumber, setCardNumber] = useState('');
//     const [shaBaCode, setShaBaCode] = useState('');
//
//     // New: bank accounts list
//     const [bankAccounts, setBankAccounts] = useState<BankAccountResponse[]>([]);
//     const [accountsLoading, setAccountsLoading] = useState<boolean>(true);
//     const [accountsError, setAccountsError] = useState<string | null>(null);
//
//     console.log("se", selectedBank)
//
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [success, setSuccess] = useState<string | null>(null);
//     const [openModal, setOpenModal] = useState(false);
//
//     const params = useParams() as { businessId?: string; clientId?: string };
//     const businessId = params.businessId ?? '';
//     const clientId = params.clientId ?? '';
//     const router = useRouter();
//
//     useEffect(() => {
//         if (logos.length > 0 && !selectedBank) {
//             setSelectedBank(logos[0]);
//         }
//     }, [logos, selectedBank]);
//
//     // close dropdown on outside click
//     useEffect(() => {
//         function handleOutside(e: MouseEvent) {
//             if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
//                 setBankDropdownOpen(false);
//             }
//         }
//
//         document.addEventListener("mousedown", handleOutside);
//         return () => document.removeEventListener("mousedown", handleOutside);
//     }, []);
//
//
//     // بارگذاری اطلاعات کاربر و حساب‌های بانکی
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
//                 // کاربر
//                 const {data} = await http.get<Client>(`/api/client/${businessId}/${clientId}`);
//                 // لوگوها
//                 const logos = await getBankLogos();
//                 setLogos(logos);
//
//                 // حساب‌های بانکی
//                 try {
//                     const accounts = await getBankAccounts(businessId, clientId);
//                     setBankAccounts(accounts ?? []);
//                     setAccountsError(null);
//
//                     // اگر یک حساب وجود داشت سعی کن لوگوی متناظر را انتخاب کنی
//                     if (accounts && accounts.length > 0 && logos.length > 0) {
//                         const firstBankName = accounts[0].bankName?.toLowerCase() ?? '';
//                         const matched = logos.find(l => l.name?.toLowerCase() === firstBankName);
//                         if (matched) setSelectedBank(matched);
//                     }
//                 } catch (accErr: any) {
//                     console.error('Failed to load bank accounts:', accErr);
//                     setBankAccounts([]);
//                     setAccountsError(accErr?.message ?? 'خطا در دریافت حساب‌های بانکی');
//                 }
//
//                 // پر کردن فرم با اطلاعات دریافتی
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
//     // helper: fill bank form for editing a selected account
//     function handleEditAccount(account: BankAccountResponse) {
//         setAccountNumber(account.accountNumber);
//         setCardNumber(account.cardNumber);
//         setShaBaCode(account.shaBaCode);
//         // try to pick matching logo if available
//         const matched = logos.find(l => l.name.toLowerCase() === account.bankName.toLowerCase());
//         if (matched) setSelectedBank(matched);
//         setOpenModal(true);
//     }
//
//     if (loading) return <div className="flex items-center justify-center min-h-screen">Loading…</div>;
//
//     return (
//         <div className="w-full min-h-screen p-4">
//             <div className="max-w-3xl mx-auto space-y-4">
//                 {/*<Card title="اطلاعات مشتری">*/}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                         <Input label="نام و نام خانوادگی" value={fullName} onChange={(e)=>setFullName(e.target.value)} />
//                         <Input label="کد ملی" value={nationalCode} onChange={(e)=>setNationalCode(e.target.value)} />
//                         <Input label="آدرس" value={address} onChange={(e)=>setAddress(e.target.value)} />
//                         <Input label="توضیحات فاکتور" value={invoiceDescription} onChange={(e)=>setInvoiceDescription(e.target.value)} />
//                     </div>
//                 {/*</Card>*/}
//
//                 {/*<Card title="حساب‌های بانکی">*/}
//                     {accountsLoading ? (
//                         <div>Loading accounts…</div>
//                     ) : accountsError ? (
//                         <div className="text-red-600">{accountsError}</div>
//                     ) : bankAccounts.length === 0 ? (
//                         <div className="text-sm text-zinc-500">حساب بانکی ثبت نشده است.</div>
//                     ) : (
//                         <div className="flex flex-col gap-3">
//                             {bankAccounts.map(acc => {
//                                 const logo = logos.find(l => l.name?.toLowerCase() === acc.bankName?.toLowerCase());
//                                 return (
//                                     <div key={acc.id} className="flex items-center justify-between p-3 border rounded">
//                                         <div className="flex items-center gap-3">
//                                             {logo?.url ? (
//                                                 <img src={logo.url} alt={logo.name} className="w-10 h-10 object-contain" />
//                                             ) : (
//                                                 <div className="w-10 h-10 flex items-center justify-center bg-zinc-100 rounded">
//                                                     <span className="text-sm">{acc.bankName?.slice(0,2)}</span>
//                                                 </div>
//                                             )}
//                                             <div>
//                                                 <div className="font-medium">{acc.bankName}</div>
//                                                 <div className="text-sm text-zinc-600">حساب: {acc.accountNumber}</div>
//                                                 <div className="text-sm text-zinc-600">کارت: {acc.cardNumber}</div>
//                                                 <div className="text-sm text-zinc-500">شبا: {acc.shaBaCode}</div>
//                                             </div>
//                                         </div>
//
//                                         <div className="flex items-center gap-2">
//                                             <Button
//                                                 label="ویرایش"
//                                                 customStyle="px-3 py-1 text-sm"
//                                                 onClick={() => handleEditAccount(acc)}
//                                             />
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     )}
//                     <div className="mt-4">
//                         <Button label="افزودن حساب جدید" icon={<MdAdd />} onClick={() => {
//                             // clear form for new account
//                             setAccountNumber('');
//                             setCardNumber('');
//                             setShaBaCode('');
//                             setSelectedBank(logos[0] ?? null);
//                             setOpenModal(true);
//                         }} />
//                     </div>
//                 {/*</Card>*/}
//             </div>
//
//             {/* Modal for create/update bank account (existing modal usage in file) */}
//             {openModal && (
//                 <Modal onClose={() => setOpenModal(false)} title="افزودن / ویرایش حساب بانکی">
//                     <div className="space-y-3">
//                         <div ref={dropdownRef} className="relative">
//                             <label className="block text-sm mb-1">بانک</label>
//                             <div className="border rounded p-2 flex items-center justify-between cursor-pointer" onClick={() => setBankDropdownOpen(v => !v)}>
//                                 <div className="flex items-center gap-2">
//                                     {selectedBank?.url ? <img src={selectedBank.url} className="w-6 h-6 object-contain" /> : null}
//                                     <span>{selectedBank?.name ?? 'انتخاب بانک'}</span>
//                                 </div>
//                                 <div>▾</div>
//                             </div>
//
//                             {bankDropdownOpen && (
//                                 <div className="absolute z-10 bg-white shadow mt-1 w-full max-h-48 overflow-auto">
//                                     {logos.map(l => (
//                                         <div key={l.name} className="p-2 hover:bg-zinc-50 cursor-pointer flex items-center gap-2" onClick={() => { setSelectedBank(l); setBankDropdownOpen(false); }}>
//                                             {l.url ? <img src={l.url} className="w-6 h-6 object-contain" /> : null}
//                                             <div>{l.name}</div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//
//                         <Input label="شماره حساب" value={accountNumber} onChange={(e)=>setAccountNumber(e.target.value)} />
//                         <Input label="شماره کارت" value={cardNumber} onChange={(e)=>setCardNumber(e.target.value)} />
//                         <Input label="شبا" value={shaBaCode} onChange={(e)=>setShaBaCode(e.target.value)} />
//
//                         <div className="flex justify-end gap-2">
//                             <Button label="انصراف" customStyle="px-3" onClick={() => setOpenModal(false)} />
//                             <Button label="ذخیره" customStyle="px-3" onClick={async () => {
//                                 // اگر می‌خواهید عملیات ایجاد/ویرایش را انجام دهید از createBankAccount / updateBankAccount استفاده کنید.
//                                 try {
//                                     const payload = {
//                                         bankName: selectedBank?.name ?? '',
//                                         accountNumber,
//                                         cardNumber,
//                                         shaBaCode
//                                     };
//                                     // برای نمونه فرض می‌کنیم اگر accountNumber موجود باشد، این عمل آپدیت است:
//                                     if (accountNumber && bankAccounts.some(a => a.accountNumber === accountNumber)) {
//                                         // پیدا کردن شناسه‌ی حساب و آپدیت
//                                         const account = bankAccounts.find(a => a.accountNumber === accountNumber)!;
//                                         await updateBankAccount(businessId, account.id, payload);
//                                     } else {
//                                         await createBankAccount(businessId, clientId, payload);
//                                     }
//
//                                     // رفرش لیست حساب‌ها
//                                     setAccountsLoading(true);
//                                     const refreshed = await getBankAccounts(businessId, clientId);
//                                     setBankAccounts(refreshed ?? []);
//                                     setSuccess('عملیات با موفقیت انجام شد');
//                                     setOpenModal(false);
//                                 } catch (err: any) {
//                                     console.error(err);
//                                     setError(err?.message ?? 'خطا در ذخیره حساب');
//                                 } finally {
//                                     setAccountsLoading(false);
//                                 }
//                             }} />
//                         </div>
//                     </div>
//                 </Modal>
//             )}
//         </div>
//     );
// }

'use client';
import {useEffect, useState, useRef} from "react";
import {useParams, useRouter} from 'next/navigation';
import {cn} from "@/utils/cn";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import Modal from "@/app/components/ui/Modal";
import Card from "@/app/components/ui/Card";
import ThemeToggle from "@/app/components/theme/ThemeToggle";
import {BankLogo, Client, getBankLogos, createBankAccount, updateBankAccount, getBankAccounts} from "@/services/client";
import {http} from "@/utils/api/http";
import {MdAdd} from "react-icons/md";

export default function EditClient() {
    const [fullName, setFullName] = useState('');
    const [nationalCode, setNationalCode] = useState('');
    const [address, setAddress] = useState('');
    const [invoiceDescription, setInvoiceDescription] = useState('');
    const [isJuridicalPerson, setIsJuridicalPerson] = useState(false);
    const [isOwnerMember, setIsOwnerMember] = useState(false);

    const [logos, setLogos] = useState<BankLogo[]>([])
    const [selectedBank, setSelectedBank] = useState<BankLogo | null>(null);
    const [bankDropdownOpen, setBankDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [accountNumber, setAccountNumber] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [shaBaCode, setShaBaCode] = useState('');
    const [bankAccounts, setBankAccounts] = useState<BankAccountResponse[]>([]);
    const [accountsLoading, setAccountsLoading] = useState<boolean>(true);
    const [accountsError, setAccountsError] = useState<string | null>(null);

    console.log("se", selectedBank)

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);

    const params = useParams() as { businessId?: string; clientId?: string };
    const businessId = params.businessId ?? '';
    const clientId = params.clientId ?? '';
    const router = useRouter();

    useEffect(() => {
        if (logos.length > 0 && !selectedBank) {
            setSelectedBank(logos[0]);
        }
    }, [logos, selectedBank]);

// close dropdown on outside click
    useEffect(() => {
        function handleOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setBankDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);


    // بارگذاری اطلاعات کاربر
    // useEffect(() => {
    //     async function loadClient() {
    //         if (!businessId || !clientId) {
    //             setError('شناسه کسب‌وکار یا مشتری نامعتبر است');
    //             return;
    //         }
    //
    //         try {
    //             const {data} = await http.get<Client>(`/api/client/${businessId}/${clientId}`);
    //             const logos = await getBankLogos();
    //             setLogos(logos);
    //             console.log("logos", logos);
    //
    //             // پر کردن فرم با اطلاعات دریافتی
    //             setFullName(data.fullname);
    //             setNationalCode(data.nationalCode);
    //             setAddress(data.address);
    //             setInvoiceDescription(data.constantDescriptionInvoice);
    //             setIsJuridicalPerson(data.isJuridicalPerson);
    //             setIsOwnerMember(data.isOwnerClient);
    //             setError(null);
    //         } catch (err: any) {
    //             console.error('Failed to load client:', err);
    //             setError(err?.message ?? 'خطا در بارگذاری اطلاعات مشتری');
    //             if (err?.response?.status === 401) {
    //                 router.push('/login');
    //             }
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    //
    //     loadClient();
    // }, [businessId, clientId, router]);

    useEffect(() => {
        async function loadClient() {
            if (!businessId || !clientId) {
                setError('شناسه کسب‌وکار یا مشتری نامعتبر است');
                setAccountsError('شناسه کسب‌وکار یا مشتری نامعتبر است');
                setAccountsLoading(false);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setAccountsLoading(true);

                // کاربر
                const {data} = await http.get<Client>(`/api/client/${businessId}/${clientId}`);
                // لوگوها
                const logos = await getBankLogos();
                setLogos(logos);

                // حساب‌های بانکی
                try {
                    const accounts = await getBankAccounts(businessId, clientId);
                    setBankAccounts(accounts ?? []);
                    setAccountsError(null);

                    // اگر یک حساب وجود داشت سعی کن لوگوی متناظر را انتخاب کنی
                    if (accounts && accounts.length > 0 && logos.length > 0) {
                        const firstBankName = accounts[0].bankName?.toLowerCase() ?? '';
                        const matched = logos.find(l => l.name?.toLowerCase() === firstBankName);
                        if (matched) setSelectedBank(matched);
                    }
                } catch (accErr: any) {
                    console.error('Failed to load bank accounts:', accErr);
                    setBankAccounts([]);
                    setAccountsError(accErr?.message ?? 'خطا در دریافت حساب‌های بانکی');
                }

                // پر کردن فرم با اطلاعات دریافتی
                setFullName(data.fullname);
                setNationalCode(data.nationalCode);
                setAddress(data.address);
                setInvoiceDescription(data.constantDescriptionInvoice);
                setIsJuridicalPerson(data.isJuridicalPerson);
                setIsOwnerMember(data.isOwnerClient);
                setError(null);
            } catch (err: any) {
                console.error('Failed to load client:', err);
                setError(err?.message ?? 'خطا در بارگذاری اطلاعات مشتری');
                if (err?.response?.status === 401) {
                    router.push('/login');
                }
            } finally {
                setLoading(false);
                setAccountsLoading(false);
            }
        }

        loadClient();
    }, [businessId, clientId, router]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            await http.put(`/api/client/${businessId}/${clientId}`, {
                fullName,
                nationalCode,
                address,
                constantDescriptionInvoice: invoiceDescription,
                isJuridicalPerson,
                isOwnerClient: isOwnerMember
            });

            setSuccess('اطلاعات مشتری با موفقیت به‌روزرسانی شد');
            router.push(`/${businessId}/clients`);
        } catch (err: any) {
            console.error('Failed to update client:', err);
            setError(err?.message ?? 'خطا در به‌روزرسانی اطلاعات مشتری');
        } finally {
            setLoading(false);
        }
    };

    async function handleAddBankAccount() {
        setError(null);
        setSuccess(null);

        if (!businessId) {
            setError("شناسه کسب‌وکار نامعتبر است");
            return;
        }

        if (!selectedBank) {
            setError("لطفاً یک بانک انتخاب کنید");
            return;
        }

        if (!accountNumber.trim()) {
            setError("شماره حساب را وارد کنید");
            return;
        }

        // تولید شناسه برای مسیر PUT. اگر crypto.randomUUID در دسترس نباشد از تاریخ استفاده می‌کنیم
        const bankAccountId =
            typeof crypto !== "undefined" && typeof (crypto as any).randomUUID === "function"
                ? (crypto as any).randomUUID()
                : `generated-${Date.now()}`;

        setLoading(true);
        try {
            const payload = {
                bankName: selectedBank.name,
                accountNumber: accountNumber.trim(),
                cardNumber: cardNumber.trim(),
                shaBaCode: shaBaCode.trim(),
            };

            const res = await createBankAccount(businessId, clientId, payload);

            setSuccess("حساب بانکی با موفقیت اضافه شد");
            // در صورت نیاز می‌توانید نتیجه را در state محلی نگه دارید یا لیستی تازه‌سازی کنید
            // پاک‌سازی فیلدهای ورودی
            setAccountNumber("");
            setCardNumber("");
            setShaBaCode("");
            // در صورت نیاز می‌توان بانک انتخاب شده را صفر کرد یا نگه داشت:
            // setSelectedBank(null);

            console.log("added bank account:", res);
        } catch (err: any) {
            console.error("Failed to add bank account:", err);
            setError(err?.message ?? "خطا در افزودن حساب بانکی");
        } finally {
            setLoading(false);
        }
    }


    if (loading) {
        return <div className="flex justify-center items-center h-screen">در حال بارگذاری...</div>;
    }

    return (
        <div className="w-full h-full py-6 px-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-medium">ویرایش اطلاعات مشتری</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="نام کامل"
                    name="fullName"
                    value={fullName}
                    containerClass={cn('w-full')}
                    onChange={(e) => setFullName(e.target.value)}
                />

                <Input
                    label="کد ملی"
                    name="nationalCode"
                    value={nationalCode}
                    containerClass={cn('w-full')}
                    onChange={(e) => setNationalCode(e.target.value)}
                />

                <Input
                    label="آدرس"
                    name="address"
                    value={address}
                    containerClass={cn('w-full')}
                    onChange={(e) => setAddress(e.target.value)}
                />

                <Input
                    label="توضیحات فاکتور"
                    name="invoiceDescription"
                    value={invoiceDescription}
                    containerClass={cn('w-full')}
                    onChange={(e) => setInvoiceDescription(e.target.value)}
                />

                <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={isJuridicalPerson}
                            onChange={(e) => setIsJuridicalPerson(e.target.checked)}
                            className="w-4 h-4"
                        />
                        <span>شخص حقوقی؟</span>
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={isOwnerMember}
                            onChange={(e) => setIsOwnerMember(e.target.checked)}
                            className="w-4 h-4"
                        />
                        <span>عضو مالک هست؟</span>
                    </label>
                </div>

                <h2>حساب های بانکی</h2>
                <button
                    onClick={() => setOpenModal(true)}
                    className="w-12 h-12 flex justify-center items-center rounded-full bg-green-600 hover:bg-green-700 transition shadow-lg"
                    title="ایجاد بیزینس"
                >
                    <MdAdd className="w-8 h-8 text-green-600"/>
                </button>

                <div className="flex gap-4 mt-6">
                    <Button
                        type="submit"
                        disabled={loading}
                        customStyle="bg-green-600 hover:bg-green-700"
                    >
                        {loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                    </Button>

                    <Button
                        type="button"
                        onClick={() => router.push(`/${businessId}/clients`)}
                        customStyle="bg-gray-500 hover:bg-gray-600"
                    >
                        انصراف
                    </Button>
                </div>

                {/*<Modal open={openModal} onClose={() => setOpenModal(false)}>*/}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">بانک</label>

                    <div ref={dropdownRef} className="relative inline-block w-full text-left">
                        <button
                            type="button"
                            onClick={() => setBankDropdownOpen((s) => !s)}
                            className="w-full flex items-center justify-between gap-3 px-3 py-2 border rounded-md bg-white hover:shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                {selectedBank ? (
                                    <img
                                        src={selectedBank.url}
                                        alt={selectedBank.name}
                                        className="w-6 h-6 object-contain rounded-sm"
                                    />
                                ) : (
                                    <div className="w-6 h-6 bg-gray-100 rounded-sm"/>
                                )}
                                <span className="text-sm">{selectedBank?.name ?? "انتخاب بانک"}</span>
                            </div>

                            <svg
                                className={`w-4 h-4 transition-transform ${bankDropdownOpen ? "rotate-180" : ""}`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path fillRule="evenodd"
                                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z"
                                      clipRule="evenodd"/>
                            </svg>
                        </button>

                        {bankDropdownOpen && (
                            <ul className="absolute right-0 left-0 mt-1 max-h-56 overflow-auto bg-white border rounded-md shadow-lg z-50">
                                {logos.map((logo) => (
                                    <li key={logo.name}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedBank(logo);
                                                setBankDropdownOpen(false);
                                            }}
                                            className="w-full text-right px-3 py-2 flex items-center gap-3 hover:bg-gray-50"
                                        >
                                            <img src={logo.url} alt={logo.name}
                                                 className="w-5 h-5 object-contain rounded-sm"/>
                                            <span className="text-sm">{logo.name}</span>
                                        </button>
                                    </li>
                                ))}
                                {logos.length === 0 && (
                                    <li className="px-3 py-2 text-sm text-gray-500">در حال بارگذاری...</li>
                                )}
                            </ul>
                        )}
                    </div>

                    {/*<Card title="حساب‌های بانکی">*/}
                    {accountsLoading ? (
                        <div>Loading accounts…</div>
                    ) : accountsError ? (
                        <div className="text-red-600">{accountsError}</div>
                    ) : bankAccounts.length === 0 ? (
                        <div className="text-sm text-zinc-500">حساب بانکی ثبت نشده است.</div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {bankAccounts.map(acc => {
                                const logo = logos.find(l => l.name?.toLowerCase() === acc.bankName?.toLowerCase());
                                return (
                                    <div key={acc.id} className="flex items-center justify-between p-3 border rounded">
                                        <div className="flex items-center gap-3">
                                            {logo?.url ? (
                                                <img src={logo.url} alt={logo.name}
                                                     className="w-10 h-10 object-contain"/>
                                            ) : (
                                                <div
                                                    className="w-10 h-10 flex items-center justify-center bg-zinc-100 rounded">
                                                    <span className="text-sm">{acc.bankName?.slice(0, 2)}</span>
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium">{acc.bankName}</div>
                                                <div className="text-sm text-zinc-600">حساب: {acc.accountNumber}</div>
                                                <div className="text-sm text-zinc-600">کارت: {acc.cardNumber}</div>
                                                <div className="text-sm text-zinc-500">شبا: {acc.shaBaCode}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                label="ویرایش"
                                                customStyle="px-3 py-1 text-sm"
                                                onClick={() => handleEditAccount(acc)}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* hidden input so form submissions (if any) receive the selected bank name */}
                    <input type="hidden" name="bankName" value={selectedBank?.name ?? ""}/>
                    <Input
                        label="شماره حساب"
                        name="accountNumber"
                        value={accountNumber}
                        containerClass={cn('w-full')}
                        onChange={(e) => setAccountNumber(e.target.value)}
                    />
                    <Input
                        label="شماره کارت"
                        name="cardNumber"
                        value={cardNumber}
                        containerClass={cn('w-full')}
                        onChange={(e) => setCardNumber(e.target.value)}
                    />
                    <Input
                        label="شماره شبا"
                        name="shaBaCode"
                        value={shaBaCode}
                        containerClass={cn('w-full')}
                        onChange={(e) => setShaBaCode(e.target.value)}
                    />
                    <Button label="افزودن" onClick={handleAddBankAccount} className="mt-4" type="button"><MdAdd/> افزودن
                        حساب
                        بانکی</Button>

                </div>

                {/*</Modal>*/}

                {error && <div className="text-red-600 mt-4">{error}</div>}
                {success && <div className="text-green-600 mt-4">{success}</div>}
            </form>
        </div>
    );
}