'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {cn} from '@/utils/cn';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';
import {updateUser} from '@/services/auth/auth.service';
import {useUser} from '@/context/UserContext';
import Loader from '@/app/components/ui/Loader';
import {updateUserValidate} from '@/services/auth/auth.validation';

type FormState = {
    fullname: string;
    nationalCode: string;
    password: string;
    confirm: string;
};

type Errors = Partial<FormState & { server: string }>;

export default function EditUserPage(): JSX.Element {
    const router = useRouter();
    const {user, loading, refresh} = useUser();

    const [form, setForm] = useState<FormState>({
        fullname: '',
        nationalCode: '',
        password: '',
        confirm: '',
    });

    const [errors, setErrors] = useState<Errors>({});
    const [saving, setSaving] = useState<boolean>(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (loading) return;
        
        if (!user) {
            router.replace('/login');
            return;
        }

        setForm({
            fullname: user.fullname || '',
            nationalCode: user.nationalCode || '',
            password: '',
            confirm: '',
        });
        
    }, [user, router]);

    const update = (key: keyof FormState, value: string) => {
        setForm(prev => ({...prev, [key]: value}));
    };

    const handleSubmit = async (ev: React.FormEvent) => {
        ev.preventDefault();
        setErrors({});

        const v = updateUserValidate(form);
        if (Object.keys(v).length) {
            setErrors(v);
            return;
        }

     
        const payload: any = {};
        if (form.fullname !== user?.fullname) payload.fullname = form.fullname;
        if (form.nationalCode !== user?.nationalCode) payload.nationalCode = form.nationalCode;
        if (form.password) payload.password = form.password;

        if (!Object.keys(payload).length) {
            router.push('/business');
            return;
        }

        setSaving(true);
        try {
            await updateUser(payload);
            await refresh();
            router.push('/business');
        } catch (err: any) {
            setErrors({
                server:
                    err?.response?.data?.message ||
                    'خطا در ویرایش اطلاعات کاربر',
            });
        } finally {
            setSaving(false);
        }
    };

    const wrapper = 'w-[90%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto';

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader/>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            dir="rtl"
            className="flex flex-col w-full min-h-screen items-center justify-center gap-4 font-sans bg-background text-foreground"
        >
            <h2 className="!text-xl !font-semibold mb-4 text-center">
                ویرایش کاربر
            </h2>

            <Input
                name="fullname"
                label="نام و نام خانوادگی"
                value={form.fullname}
                onChange={(e) => update('fullname', e.target.value)}
                containerClass={wrapper}
                inputClass="w-full h-[40px]"
                error={errors.fullname}
            />

            <Input
                name="nationalCode"
                label="کد ملی"
                value={form.nationalCode}
                onChange={(e) => update('nationalCode', e.target.value)}
                containerClass={wrapper}
                inputClass="w-full h-[40px]"
                error={errors.nationalCode}
            />
            
            <Input
                name="password"
                label="رمز عبور جدید"
                type='password'
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                containerClass={cn('w-[90%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto')}
                inputClass={cn('w-full h-[40px]')}
                error={errors.password}
            />
            
            <Input
                name="confirm"
                label="تکرار رمز عبور"
                type='password'
                value={form.confirm}
                onChange={(e) => update('confirm', e.target.value)}
                containerClass={cn('w-[90%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto')}
                inputClass={cn('w-full h-[40px]')}
                error={errors.confirm}
            />
            {errors.server && (
                <p className="text-sm text-red-600 mt-2 text-center">
                    {errors.server}
                </p>
            )}

            <div className={wrapper}>
                <Button
                    type="submit"
                    label={saving ? 'در حال ذخیره…' : 'ذخیره تغییرات'}
                    customStyle="w-full h-[40px] text-base disabled:opacity-60 !mt-6"
                    disabled={saving}
                />
            </div>
        </form>
    );
}
