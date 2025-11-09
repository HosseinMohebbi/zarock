'use client';
import {useState} from "react";
import {cn} from "@/utils/cn";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import Card from "@/app/components/ui/Card";
import ThemeToggle from "@/app/components/theme/ThemeToggle";
import {createClient} from "@/services/client";

export default function Client() {
    const [fullName, setFullName] = useState('');
    const [nationalCode, setNationalCode] = useState('');
    const [address, setAddress] = useState('');
    const [invoiceDescription, setInvoiceDescription] = useState('');
    const [isJuridicalPerson, setIsJuridicalPerson] = useState(false);
    const [isOwnerMember, setIsOwnerMember] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const addTag = () => {
        const t = tagInput.trim();
        if (!t) return;
        if (tags.includes(t)) {
            setTagInput('');
            return;
        }
        setTags(prev => [...prev, t]);
        setTagInput('');
    };

    const removeTag = (t: string) => {
        setTags(prev => prev.filter(x => x !== t));
    };

    const validate = (): string | null => {
        if (!fullName.trim()) return 'نام کامل لازم است.';
        if (!nationalCode.trim()) return 'کد ملی لازم است.';
        return null;
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setError(null);
        setSuccess(null);

        const v = validate();
        if (v) {
            setError(v);
            return;
        }

        const payload = {
            fullName: fullName.trim(),
            nationalCode: nationalCode.trim(),
            constantDescriptionInvoice: invoiceDescription.trim(),
            isJuridicalPerson,
            isOwnerMember,
            address: address.trim(),
            tags
        };

        setLoading(true);
        try {
            // استفاده از سرویس createClient به جای fetch مستقیم
            const res = await createClient(payload);
            // فرض می‌کنیم پاسخ فرمتی مثل { success: boolean, message?: string } دارد
            if (!res || (res.success === false)) {
                setError(res?.message || 'خطا در ایجاد مشتری.');
            } else {
                setSuccess(res.message || 'مشتری با موفقیت ایجاد شد.');
                // پاک‌سازی فرم
                setFullName('');
                setNationalCode('');
                setAddress('');
                setInvoiceDescription('');
                setIsJuridicalPerson(false);
                setIsOwnerMember(false);
                setTags([]);
            }
        } catch (err: any) {
            // خطا را به صورت کاربرپسند نشان می‌دهیم
            const msg = err?.response?.data?.message || err?.message || 'خطا در اتصال به سرور.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-full py-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-medium">شخص جدید</h1>
                <ThemeToggle/>
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
                    name="natioalCode"
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

                {/* بقیه فیلدها را مشابه قبلی اضافه کنید */}
                <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                        {loading ? 'در حال ارسال...' : 'ایجاد'}
                    </Button>
                </div>

                {error && <div className="text-red-600 mt-2">{error}</div>}
                {success && <div className="text-green-600 mt-2">{success}</div>}
            </form>
        </div>
    );
}

// 'use client';
// import {useState} from "react";
// import {cn} from "@/utils/cn";
// import Input from "@/app/components/ui/Input";
// import Button from "@/app/components/ui/Button";
// import Card from "@/app/components/ui/Card";
// import ThemeToggle from "@/app/components/theme/ThemeToggle";
//
// export default function Client() {
//     const [fullName, setFullName] = useState('');
//     const [nationalCode, setNationalCode] = useState('');
//     const [address, setAddress] = useState('');
//     const [invoiceDescription, setInvoiceDescription] = useState(''); // mapped to constantDescriptionInvoice
//     const [isJuridicalPerson, setIsJuridicalPerson] = useState(false);
//     const [isOwnerMember, setIsOwnerMember] = useState(false);
//     const [tagInput, setTagInput] = useState('');
//     const [tags, setTags] = useState<string[]>([]);
//
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [success, setSuccess] = useState<string | null>(null);
//
//     const addTag = () => {
//         const t = tagInput.trim();
//         if (!t) return;
//         if (tags.includes(t)) {
//             setTagInput('');
//             return;
//         }
//         setTags(prev => [...prev, t]);
//         setTagInput('');
//     };
//
//     const removeTag = (t: string) => {
//         setTags(prev => prev.filter(x => x !== t));
//     };
//
//     const validate = (): string | null => {
//         if (!fullName.trim()) return 'نام کامل لازم است.';
//         if (!nationalCode.trim()) return 'کد ملی لازم است.';
//         // در صورت نیاز، می‌توانید regex کد ملی را اینجا اضافه کنید
//         return null;
//     };
//
//     const handleSubmit = async (e?: React.FormEvent) => {
//         e?.preventDefault();
//         setError(null);
//         setSuccess(null);
//
//         const v = validate();
//         if (v) {
//             setError(v);
//             return;
//         }
//
//         const payload = {
//             fullName: fullName.trim(),
//             nationalCode: nationalCode.trim(),
//             constantDescriptionInvoice: invoiceDescription.trim(),
//             isJuridicalPerson,
//             isOwnerMember,
//             address: address.trim(),
//             tags
//         };
//
//         setLoading(true);
//         try {
//             const res = await fetch('/api/clients', {
//                 method: 'POST',
//                 headers: {'Content-Type': 'application/json'},
//                 body: JSON.stringify(payload)
//             });
//
//             if (!res.ok) {
//                 const text = await res.text().catch(() => null);
//                 setError(text || `خطا در سرور: ${res.status}`);
//             } else {
//                 setSuccess('مشتری با موفقیت ایجاد شد.');
//                 // پاک‌سازی فرم در صورت نیاز:
//                 setFullName('');
//                 setNationalCode('');
//                 setAddress('');
//                 setInvoiceDescription('');
//                 setIsJuridicalPerson(false);
//                 setIsOwnerMember(false);
//                 setTags([]);
//             }
//         } catch (err) {
//             setError('خطا در اتصال به سرور.');
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <div className="w-full h-full py-6">
//             {/*<Card className="max-w-3xl mx-auto p-6">*/}
//                 <div className="flex items-center justify-between mb-4">
//                     <h1 className="text-lg font-medium">شخص جدید</h1>
//                     <ThemeToggle />
//                 </div>
//
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <Input
//                         label="نام کامل"
//                         name="fullName"
//                         value={fullName}
//                         containerClass={cn('w-full')}
//                         inputClass={cn('w-full h-[40px]')}
//                         onChange={(e) => setFullName(e.target.value)}
//                     />
//
//                     <Input
//                         label="کد ملی"
//                         name="nationalCode"
//                         value={nationalCode}
//                         containerClass={cn('w-full')}
//                         inputClass={cn('w-full h-[40px]')}
//                         onChange={(e) => setNationalCode(e.target.value)}
//                     />
//
//                     <Input
//                         label="آدرس"
//                         name="address"
//                         value={address}
//                         containerClass={cn('w-full')}
//                         inputClass={cn('w-full h-[40px]')}
//                         onChange={(e) => setAddress(e.target.value)}
//                     />
//
//                     <div>
//                         <label className="block text-sm mb-1">توضیحات صورت‌حساب</label>
//                         <textarea
//                             name="description"
//                             value={invoiceDescription}
//                             onChange={(e) => setInvoiceDescription(e.target.value)}
//                             className="w-full min-h-[80px] p-2 border rounded"
//                         />
//                     </div>
//
//                     <div className="flex gap-6">
//                         <label className="flex items-center gap-2">
//                             <input
//                                 type="checkbox"
//                                 checked={isJuridicalPerson}
//                                 onChange={(e) => setIsJuridicalPerson(e.target.checked)}
//                                 className="w-4 h-4"
//                             />
//                             <span>شخص حقوقی؟</span>
//                         </label>
//
//                         <label className="flex items-center gap-2">
//                             <input
//                                 type="checkbox"
//                                 checked={isOwnerMember}
//                                 onChange={(e) => setIsOwnerMember(e.target.checked)}
//                                 className="w-4 h-4"
//                             />
//                             <span>عضو مالک هست؟</span>
//                         </label>
//                     </div>
//
//                     <div>
//                         <label className="block text-sm mb-1">تگ‌ها</label>
//                         <div className="flex gap-2">
//                             <input
//                                 value={tagInput}
//                                 onChange={(e) => setTagInput(e.target.value)}
//                                 onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
//                                 className="flex-1 p-2 border rounded"
//                                 placeholder="برای اضافه کردن تگ Enter را بزنید"
//                             />
//                             <Button type="button" onClick={addTag}>اضافه</Button>
//                         </div>
//                         <div className="mt-2 flex flex-wrap gap-2">
//                             {tags.map(t => (
//                                 <span key={t} className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded">
//                   <span>{t}</span>
//                   <button
//                       type="button"
//                       onClick={() => removeTag(t)}
//                       className="text-sm text-red-500"
//                   >
//                     حذف
//                   </button>
//                 </span>
//                             ))}
//                         </div>
//                     </div>
//
//                     {error && <div className="text-sm text-red-600">{error}</div>}
//                     {success && <div className="text-sm text-green-600">{success}</div>}
//
//                     <div className="flex items-center gap-3">
//                         <Button type="submit" disabled={loading}>
//                             {loading ? 'در حال ارسال...' : 'ذخیره'}
//                         </Button>
//                         <Button type="button" variant="ghost" onClick={() => {
//                             setFullName('');
//                             setNationalCode('');
//                             setAddress('');
//                             setInvoiceDescription('');
//                             setIsJuridicalPerson(false);
//                             setIsOwnerMember(false);
//                             setTags([]);
//                             setError(null);
//                             setSuccess(null);
//                         }}>
//                             پاک‌سازی
//                         </Button>
//                     </div>
//                 </form>
//             {/*</Card>*/}
//         </div>
//     );
// }
