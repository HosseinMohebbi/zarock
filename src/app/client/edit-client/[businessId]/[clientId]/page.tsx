// 'use client';
// import { useState } from "react";
// import { cn } from "@/utils/cn";
// import Input from "@/app/components/ui/Input";
// import Button from "@/app/components/ui/Button";
// import ThemeToggle from "@/app/components/theme/ThemeToggle";
// import Card from "@/app/components/ui/Card";
// import { MdAccountBalanceWallet } from "react-icons/md";
//
// export default function Home() {
//     // user fields
//     const [fullName, setFullName] = useState('');
//     const [nationalCode, setNationalCode] = useState('');
//     const [address, setAddress] = useState('');
//     const [constantDescriptionInvoice, setConstantDescriptionInvoice] = useState('');
//     const [isJuridicalPerson, setIsJuridicalPerson] = useState(false);
//     const [isOwnerClient, setIsOwnerClient] = useState(false);
//
//     // bank account fields
//     const [bankName, setBankName] = useState('');
//     const [accountNumber, setAccountNumber] = useState('');
//     const [cardNumber, setCardNumber] = useState('');
//     const [shaba, setShaba] = useState('');
//
//     // optional: login-like fields that were present before
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//
//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         const payload = {
//             fullName,
//             nationalCode,
//             address,
//             constantDescriptionInvoice,
//             isJuridicalPerson,
//             isOwnerClient,
//             bank: {
//                 bankName,
//                 accountNumber,
//                 cardNumber,
//                 shaba,
//             },
//             // demo: old fields
//             username,
//             password,
//         };
//         // فعلاً لاگ می‌کنیم؛ اینجا جای فراخوانی API مانند createClient است
//         console.log("payload to send:", payload);
//     };
//
//     return (
//         <div>
//             <ThemeToggle />
//             <div className="flex flex-col w-full min-h-screen items-center justify-center gap-4 font-sans bg-background text-foreground">
//                 <form onSubmit={handleSubmit} className="w-[90%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto flex flex-col gap-3">
//                     <Input
//                         label="نام کامل"
//                         name="fullName"
//                         value={fullName}
//                         inputClass={cn('w-full h-[40px]')}
//                         onChange={(e) => setFullName(e.target.value)}
//                     />
//
//                     <Input
//                         label="کد ملی"
//                         name="nationalCode"
//                         value={nationalCode}
//                         inputClass={cn('w-full h-[40px]')}
//                         onChange={(e) => setNationalCode(e.target.value)}
//                     />
//
//                     <Input
//                         label="آدرس"
//                         name="address"
//                         value={address}
//                         inputClass={cn('w-full h-[40px]')}
//                         onChange={(e) => setAddress(e.target.value)}
//                     />
//
//                     <Input
//                         label="توضیح ثابت برای فاکتور"
//                         name="constantDescriptionInvoice"
//                         value={constantDescriptionInvoice}
//                         inputClass={cn('w-full h-[40px]')}
//                         onChange={(e) => setConstantDescriptionInvoice(e.target.value)}
//                     />
//
//                     <div className="flex gap-4 items-center">
//                         <label className="flex items-center gap-2">
//                             <input
//                                 type="checkbox"
//                                 checked={isJuridicalPerson}
//                                 onChange={(e) => setIsJuridicalPerson(e.target.checked)}
//                             />
//                             <span>شخص حقوقی</span>
//                         </label>
//
//                         <label className="flex items-center gap-2">
//                             <input
//                                 type="checkbox"
//                                 checked={isOwnerClient}
//                                 onChange={(e) => setIsOwnerClient(e.target.checked)}
//                             />
//                             <span>مالک/عضو</span>
//                         </label>
//                     </div>
//
//                     <hr className="my-2" />
//
//                     <h3 className="text-lg font-medium">اطلاعات حساب بانکی</h3>
//
//                     <Input
//                         label="نام بانک"
//                         name="bankName"
//                         value={bankName}
//                         inputClass={cn('w-full h-[40px]')}
//                         onChange={(e) => setBankName(e.target.value)}
//                     />
//
//                     <Input
//                         label="شماره حساب"
//                         name="accountNumber"
//                         value={accountNumber}
//                         inputClass={cn('w-full h-[40px]')}
//                         onChange={(e) => setAccountNumber(e.target.value)}
//                     />
//
//                     <Input
//                         label="شماره کارت"
//                         name="cardNumber"
//                         value={cardNumber}
//                         inputClass={cn('w-full h-[40px]')}
//                         onChange={(e) => setCardNumber(e.target.value)}
//                     />
//
//                     <Input
//                         label="شماره شبا"
//                         name="shaba"
//                         value={shaba}
//                         inputClass={cn('w-full h-[40px]')}
//                         onChange={(e) => setShaba(e.target.value)}
//                     />
//
//                     <div className="w-full">
//                         <Button
//                             type="submit"
//                             label="ذخیره"
//                             customStyle="p-[6.2px] h-fit w-[100%] h-[40px] text-[22px] hover:bg-green-700"
//                         />
//                     </div>
//                 </form>
//
//                 <Card customStyle="w-80" title="تراکنش ها" icon={<MdAccountBalanceWallet className="w-8 h-8 text-green-600" />} />
//             </div>
//         </div>
//     );
// }

'use client';
import { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import { cn } from "@/utils/cn";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import Card from "@/app/components/ui/Card";
import ThemeToggle from "@/app/components/theme/ThemeToggle";
import { Client } from "@/services/client";
import { http } from "@/utils/api/http";

export default function EditClient() {
    const [fullName, setFullName] = useState('');
    const [nationalCode, setNationalCode] = useState('');
    const [address, setAddress] = useState('');
    const [invoiceDescription, setInvoiceDescription] = useState('');
    const [isJuridicalPerson, setIsJuridicalPerson] = useState(false);
    const [isOwnerMember, setIsOwnerMember] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const params = useParams() as { businessId?: string; clientId?: string };
    const businessId = params.businessId ?? '';
    const clientId = params.clientId ?? '';
    const router = useRouter();

    // بارگذاری اطلاعات کاربر
    useEffect(() => {
        async function loadClient() {
            if (!businessId || !clientId) {
                setError('شناسه کسب‌وکار یا مشتری نامعتبر است');
                return;
            }

            try {
                const { data } = await http.get<Client>(`/api/client/${businessId}/${clientId}`);

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

                {error && <div className="text-red-600 mt-4">{error}</div>}
                {success && <div className="text-green-600 mt-4">{success}</div>}
            </form>
        </div>
    );
}