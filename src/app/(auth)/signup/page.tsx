'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';
import { registerUser } from '@/services/auth/auth.service';
import { RegisterResponse } from '@/services/auth/auth.types';
import { signupValidate } from '@/services/auth/auth.validation';
import { toast } from "react-toastify";

type FormState = {
    userName: string;
    fullname: string;
    nationalCode: string;
    password: string;
    confirm: string;
};

export default function SignupPage(): JSX.Element {
    const router = useRouter();

    const [form, setForm] = useState<FormState>({
        userName: '',
        fullname: '',
        nationalCode: '',
        password: '',
        confirm: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (ev: React.FormEvent) => {
        ev.preventDefault();
        setErrors({});

        // ✔ validation سمت کلاینت
        const v = signupValidate(form);
        if (Object.keys(v).length) {
            setErrors(v);
            return;
        }

        setLoading(true);
        setErrors({});
        try {
            const res: RegisterResponse = await registerUser({
                userName: form.userName.trim(),
                fullname: form.fullname.trim(),
                nationalCode: form.nationalCode.trim(),
                password: form.password.trim(),
            });

            // ذخیره توکن
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth_token', res.token);
                localStorage.setItem('auth_expires', res.expires);
            }

            toast.success("ثبت‌نام با موفقیت انجام شد. خوش آمدید");

            // پاک کردن فرم
            setForm({
                userName: '',
                fullname: '',
                nationalCode: '',
                password: '',
                confirm: '',
            });

            router.push('/business');

        } catch (err: any) {
            const msg = err.response?.data?.detail;
            const fieldErrors: Record<string, string> = {};

            // ✔ تشخیص ارور مربوط به username
            if (msg?.includes("Username")) {
                fieldErrors.userName = "این نام کاربری قبلاً ثبت شده است";
            }

            // ✔ تشخیص ارور مربوط به national code
            if (msg?.includes("national Code")) {
                fieldErrors.nationalCode = "این کد ملی قبلاً ثبت شده است";
            }

            // ✔ اگر هیچکدام نبود → پیام کلی سرور
            if (!Object.keys(fieldErrors).length) {
                fieldErrors.server = msg || "خطا در ثبت‌نام";
            }

            setErrors(fieldErrors);
        } finally {
            setLoading(false);
        }
    };

    const update = (key: string, value: any) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div>
            <form
                onSubmit={handleSubmit}
                dir="rtl"
                className="flex flex-col w-full min-h-screen items-center justify-center gap-4 font-sans bg-background text-foreground"
            >
                <h2 className="!text-3xl !font-bold mb-4 text-center">ثبت‌نام</h2>

                <Input
                    label="نام کاربری"
                    name="userName"
                    value={form.userName}
                    containerClass={cn('w-[90%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto')}
                    inputClass={cn('w-full h-[40px]')}
                    onChange={(e) => update("userName", e.target.value)}
                    error={errors.userName}
                />

                <Input
                    label="نام و نام خانوادگی"
                    name="fullname"
                    value={form.fullname}
                    containerClass={cn('w-[90%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto')}
                    inputClass={cn('w-full h-[40px]')}
                    onChange={(e) => update("fullname", e.target.value)}
                    error={errors.fullname}
                />

                <Input
                    label="کد ملی"
                    name="nationalCode"
                    value={form.nationalCode}
                    containerClass={cn('w-[90%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto')}
                    inputClass={cn('w-full h-[40px]')}
                    onChange={(e) => update("nationalCode", e.target.value)}
                    error={errors.nationalCode}
                />

                <Input
                    label="رمز عبور"
                    name="password"
                    type="password"
                    value={form.password}
                    containerClass={cn('w-[90%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto')}
                    inputClass={cn('w-full h-[40px]')}
                    onChange={(e) => update("password", e.target.value)}
                    error={errors.password}
                />

                <Input
                    label="تایید رمز عبور"
                    name="confirm"
                    type="password"
                    value={form.confirm}
                    containerClass={cn('w-[90%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto')}
                    inputClass={cn('w-full h-[40px]')}
                    onChange={(e) => update("confirm", e.target.value)}
                    error={errors.confirm}
                />

                {/* پیام کلی سرور */}
                {errors.server && (
                    <p className="text-sm text-red-600 mt-3 text-center">{errors.server}</p>
                )}

                <div className="w-[90%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto">
                    <Button
                        type="submit"
                        label={loading ? 'در حال ارسال…' : 'ثبت‌نام'}
                        customStyle="w-full h-[40px] text-base disabled:opacity-60 !mt-6"
                        disabled={loading}
                    />
                </div>

                <Link href="/login" className="text-md">
                    حساب دارید؟ وارد شوید
                </Link>
            </form>
        </div>
    );
}

