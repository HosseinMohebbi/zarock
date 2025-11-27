'use client';
import React, {useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {cn} from "@/utils/cn";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import {createClient} from '@/services/client/client.service'
import {validateClient, FieldErrors} from '@/services/client/client.validation'
import {toast} from "react-toastify";


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

        // اعتبارسنجی فیلدها
        const fieldErrs: FieldErrors = validateClient({
            fullName,
            nationalCode,
            address
        });
        setFieldErrors(fieldErrs);

        // اگر خطای فیلد داریم، جلوتر نریم
        if (Object.keys(fieldErrs).length > 0) {
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
            // setSuccess('شخص با موفقیت اضافه شد');
            toast.success('شخص با موفقیت اضافه شد')
            // هدایت به لیست مشتریان
            router.push(`/business/${businessId}/clients`);
        } catch (err: any) {
            setError(err?.message ?? 'خطای سرور');
            toast.error('خطا در افزودن شخص!')
        } finally {
            setLoading(false);
        }
    };
    

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
                        label="توضیحات"
                        name="invoiceDescription"
                        value={invoiceDescription}
                        onChange={(e) => setInvoiceDescription(e.target.value)}
                    />

                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium">نوع شخص</label>

                        {/* رادیوهای حقیقی/حقوقی */}
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="personType"
                                    value="real"
                                    checked={!isJuridicalPerson}
                                    onChange={() => setIsJuridicalPerson(false)}
                                    className="w-4 h-4 accent-primary"
                                />
                                <span>شخص حقیقی</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="personType"
                                    value="legal"
                                    checked={isJuridicalPerson}
                                    onChange={() => setIsJuridicalPerson(true)}
                                    className="w-4 h-4 accent-primary"
                                />
                                <span>شخص حقوقی</span>
                            </label>
                        </div>

                        {/* چک باکس عضو مالک */}
                        <label className="flex items-center gap-2 mt-2">
                            <input
                                type="checkbox"
                                checked={isOwnerMember}
                                onChange={(e) => setIsOwnerMember(e.target.checked)}
                                className="w-4 h-4 accent-primary"
                            />
                            <span>عضو مالک هست؟</span>
                        </label>
                    </div>

                    {/* چک‌باکس‌ها */}
                    {/*<div className="flex flex-col gap-2">*/}
                    {/*    <label className="text-lg font-medium">نوع شخص</label>*/}
                    {/*    <div className="flex gap-6">*/}
                    {/*        <label className="flex items-center gap-2">*/}
                    {/*            <input*/}
                    {/*                type="checkbox"*/}
                    {/*                checked={isJuridicalPerson}*/}
                    {/*                onChange={(e) => setIsJuridicalPerson(e.target.checked)}*/}
                    {/*                className="w-4 h-4 accent-primary"*/}
                    {/*            />*/}
                    {/*            <span>شخص حقوقی؟</span>*/}
                    {/*        </label>*/}
                    
                    {/*        <label className="flex items-center gap-2">*/}
                    {/*            <input*/}
                    {/*                type="checkbox"*/}
                    {/*                checked={isOwnerMember}*/}
                    {/*                onChange={(e) => setIsOwnerMember(e.target.checked)}*/}
                    {/*                className="w-4 h-4 accent-primary"*/}
                    {/*            />*/}
                    {/*            <span>عضو مالک هست؟</span>*/}
                    {/*        </label>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

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