'use client';
import React, {useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import {createClient} from '@/services/client/client.service'
import {validateClient, FieldErrors} from '@/services/client/client.validation'
import {toast} from "react-toastify";

export default function Client() {
    const [fullName, setFullName] = useState('');
    const [nationalCode, setNationalCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [invoiceDescription, setInvoiceDescription] = useState('');
    const [isJuridicalPerson, setIsJuridicalPerson] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const params = useParams() as { businessId?: string };
    const businessId = params.businessId ?? '';
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setError(null);
        setSuccess(null);

        // اعتبارسنجی فیلدها
        const fieldErrs: FieldErrors = validateClient({
            fullName,
            nationalCode,
            phoneNumber,
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
            phoneNumber: phoneNumber.trim(),
            constantDescriptionInvoice: invoiceDescription.trim(),
            isJuridicalPerson,
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
        <div className="w-full flex justify-center !px-4 !pt-24">
            <div className="w-full max-w-lg md:max-w-4xl mx-auto !p-6 bg-background text-foreground">
                <div className="flex items-center justify-between !mb-4">
                    <h1 className="!text-xl !font-semibold text-center w-full">
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

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                    {/* شماره تلفن */}
                    <Input
                        label="شماره تلفن"
                        name="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        error={fieldErrors.phoneNumber}
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

                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-lg font-medium">نوع شخص</label>

                        {/* Toggle buttons for حقیقی/حقوقی */}
                        <div className="flex">
                            <button
                                type="button"
                                className={`!px-6 !py-2 !border !border-gray-300 !rounded-r-md !cursor-pointer ${
                                    !isJuridicalPerson ? '!bg-green-500 text-white' : '!bg-background text-black'
                                }`}
                                onClick={() => setIsJuridicalPerson(false)}
                            >
                                حقیقی
                            </button>
                            <button
                                type="button"
                                className={`!px-6 !py-2 !border !border-gray-300 !rounded-l-md !cursor-pointer ${
                                    isJuridicalPerson ? '!bg-green-500 text-white' : '!bg-background text-black'
                                }`}
                                onClick={() => setIsJuridicalPerson(true)}
                            >
                                حقوقی
                            </button>
                        </div>
                    </div>

                    {/* دکمه‌ها */}
                    <div className="flex justify-end items-center gap-3 !mt-3 md:col-span-2">
                        <Button
                            label="لغو"
                            type="button"
                            onClick={handleCancel}
                            customStyle="!bg-danger"
                        />
                        <Button
                            label="ذخیره"
                            type="submit"
                            customStyle="!bg-confirm"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}