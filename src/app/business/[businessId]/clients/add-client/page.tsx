'use client';
import React, {useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {cn} from "@/utils/cn";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import ThemeToggle from "@/app/components/theme/ThemeToggle";
import {createClient} from "@/services/client";
// import {createClient} from '@/services/client/client.service'
import {validateClient, FieldErrors} from '@/services/client/client.validation'


export default function Client() {
    const [fullName, setFullName] = useState('');
    const [nationalCode, setNationalCode] = useState('');
    const [address, setAddress] = useState('');
    const [invoiceDescription, setInvoiceDescription] = useState('');
    const [isJuridicalPerson, setIsJuridicalPerson] = useState(false);
    const [isOwnerMember, setIsOwnerMember] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const params = useParams() as { businessId?: string };
    const businessId = params.businessId ?? '';
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // const errors = validateClient({fullname, nationalCode, address});
    // setFieldErrors(errors);

    const validate = (): FieldErrors => {
        const errors: FieldErrors = {};

        const name = fullName.trim();
        const nc = nationalCode.trim();
        const addr = address.trim();

        // فقط حروف فارسی و فاصله
        const persianNameRegex = /^[\u0600-\u06FF\s]+$/;

        // نام کامل: اجباری + فقط حروف فارسی و فاصله
        if (!name) {
            errors.fullName = 'نام کامل الزامی است.';
        } else if (!persianNameRegex.test(name)) {
            errors.fullName = 'نام کامل فقط می‌تواند شامل حروف فارسی و فاصله باشد.';
        }

        // کد ملی: اختیاری، ولی اگر پر شد باید عدد ۱۰ رقمی باشد
        if (nc) {
            if (!/^\d{10}$/.test(nc)) {
                errors.nationalCode = 'کد ملی باید یک عدد ۱۰ رقمی باشد.';
            }
        }

        // آدرس: اختیاری، ولی اگر پر شد حداقل ۱۰ کاراکتر
        if (addr) {
            if (addr.length < 10) {
                errors.address = 'آدرس در صورت وارد شدن باید حداقل ۱۰ کاراکتر باشد.';
            }
        }

        return errors;
    };


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
            await createClient(businessId, payload);
            // بعد از موفقیت هدایت به لیست اشخاص
            router.push(`/business/${businessId}/clients`);
        } catch (err: any) {
            setError(err?.message ?? 'خطای سرور');
        } finally {
            setLoading(false);
        }
    };
    // const handleSubmit = async (e?: React.FormEvent) => {
    //     console.log('handleAddClick called');
    //     e?.preventDefault();
    //     setError(null);
    //     setSuccess(null);
    //
    //     const errors = validateClient({fullName, nationalCode, address});
    //     setFieldErrors(errors);
    //
    //     // اگر هر فیلدی خطا داشت، جلوتر نرو
    //     if (errors) {
    //         return;
    //     }
    //
    //     const payload = {
    //         fullName: fullName.trim(),
    //         nationalCode: nationalCode.trim(),
    //         constantDescriptionInvoice: invoiceDescription.trim(),
    //         isJuridicalPerson,
    //         isOwnerMember,
    //         address: address.trim(),
    //         tags
    //     };
    //
    //     setLoading(true);
    //     try {
    //         console.log(businessId, payload)
    //         // await createClient(businessId, payload);
    //         // router.push(`/business/${businessId}/clients`);
    //     } catch (err: any) {
    //         setError(err?.message ?? 'خطای سرور');
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const handleCancel = () => {
        router.push(`/business/${businessId}/clients`);
    };

    return (
        <div className="w-full flex justify-center !px-4">
            <div className="w-full max-w-lg mx-auto !p-6 bg-background text-foreground rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-semibold text-center w-full">
                        شخص جدید
                    </h1>
                </div>

                {/* پیام‌ها */}
                {success && (
                    <div className="!mb-4 text-sm text-center">
                        <span className="inline-block !px-3 !py-1 bg-green-100 text-green-800 rounded">
                            {success}
                        </span>
                    </div>
                )}

                {error && (
                    <div className="!mb-4 text-sm text-center">
                        <span className="inline-block !px-3 !py-1 bg-red-100 text-red-800 rounded">
                            {error}
                        </span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* نام کامل */}
                    <Input
                        label="نام کامل"
                        name="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        error={fieldErrors.fullName}
                    />

                    {/* کد ملی */}
                    <Input
                        label="کد ملی"
                        name="nationalCode"
                        value={nationalCode}
                        onChange={(e) => setNationalCode(e.target.value)}
                        error={fieldErrors.nationalCode}
                    />

                    {/* آدرس */}
                    <Input
                        label="آدرس"
                        name="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        error={fieldErrors.address}
                    />

                    {/* توضیحات فاکتور */}
                    <Input
                        label="توضیحات فاکتور"
                        name="invoiceDescription"
                        value={invoiceDescription}
                        onChange={(e) => setInvoiceDescription(e.target.value)}
                    />

                    {/* تگ‌ها */}
                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium">تگ‌ها</label>

                        <div className="flex gap-2 items-center">
                            <input
                                className="text-base !px-3 !py-2 border outline-2 outline-border !rounded-lg flex-1 shadow-sm focus:outline-primary"
                                placeholder="برای افزودن Enter بزنید یا با کاما جدا کنید"
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addTag();
                                    }
                                }}
                                onBlur={addTag}
                            />

                            <button
                                type="button"
                                onClick={addTag}
                                className="!px-3 !py-2 bg-gray-100 rounded"
                            >
                                افزودن
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 !mt-2">
                            {tags.map(t => (
                                <span
                                    key={t}
                                    className="flex items-center gap-2 bg-gray-100 !px-2 !py-1 rounded text-sm"
                                >
                                    {t}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(t)}
                                        className="text-red-500"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* چک‌باکس‌ها */}
                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium">نوع شخص</label>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={isJuridicalPerson}
                                    onChange={(e) => setIsJuridicalPerson(e.target.checked)}
                                    className="w-4 h-4 accent-primary"
                                />
                                <span>شخص حقوقی؟</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={isOwnerMember}
                                    onChange={(e) => setIsOwnerMember(e.target.checked)}
                                    className="w-4 h-4 accent-primary"
                                />
                                <span>عضو مالک هست؟</span>
                            </label>
                        </div>
                    </div>

                    {/* دکمه‌ها */}
                    <div className="flex justify-end items-center gap-3 !mt-3">
                        <Button
                            label="لغو"
                            type="button"
                            onClick={handleCancel}
                        />
                        <Button
                            label={loading ? 'در حال افزودن...' : 'افزودن'}
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}