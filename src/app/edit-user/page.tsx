'use client';

import React, {useEffect, useMemo, useState} from 'react';
import {useRouter} from 'next/navigation';
import {cn} from '@/utils/cn';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';
import { updateUser } from '@/services/auth/auth.service';
import { UpdateUserResponse } from '@/services/auth/auth.types';
import {useUser} from '@/context/UserContext';

type Errors = Partial<{
    fullname: string;
    nationalCode: string;
    password: string;
    confirm: string;
    server: string;
}>;

export default function ProfilePage(): JSX.Element {
    const router = useRouter();
    const {user, loading, refresh} = useUser();

    // فرم‌های قابل ویرایش
    const [fullname, setFullname] = useState<string>('');
    const [nationalCode, setNationalCode] = useState<string>('');
    const [role, setRole] = useState<string>('Normal');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const [errors, setErrors] = useState<Errors>({});
    const [saving, setSaving] = useState<boolean>(false);

    // وقتی user از context آمد، فرم را مقداردهی کن
    useEffect(() => {
        if (!loading && !user) {
            // اگر کاربر لاگین نیست برو به لاگین
            router.replace('/login');
            return;
        }
        if (user) {
            setFullname(user.fullname || '');
            setNationalCode(user.nationalCode || '');
            setRole(user.role || 'Normal');
        }
    }, [loading, user, router]);

    const username = useMemo(() => user?.username ?? '', [user]);

    const validate = (): Errors => {
        const e: Errors = {};
        // فیلدها اختیاری‌اند؛ فقط پسورد اگر وارد شد بررسی می‌شود
        if (password) {
            if (password.length < 6) e.password = 'رمز باید حداقل 6 کاراکتر باشد';
            if (password !== confirmPassword) e.confirm = 'تایید رمز برابر نیست';
        }
        return e;
    };

    const handleSubmit = async (ev: React.FormEvent) => {
        ev.preventDefault();
        setErrors({});
        if (!user) return;

        const e = validate();
        if (Object.keys(e).length) {
            setErrors(e);
            return;
        }

        // فقط فیلدهای تغییر کرده/پُرشده را بفرست
        const payload: Record<string, any> = {};
        if (fullname && fullname !== user.fullname) payload.fullname = fullname;
        if (nationalCode && nationalCode !== user.nationalCode) payload.nationalCode = nationalCode;
        if (role && role !== user.role) payload.role = role;
        if (password) payload.password = password;

        // اگر تغییری نیست، می‌تونی همین‌جا برگردی یا ریدایرکت کنی
        if (Object.keys(payload).length === 0) {
            router.push('/business');
            return;
        }

        setSaving(true);
        try {
            const res: UpdateUserResponse = await updateUser(payload);

            // پس از موفقیت، context را تازه کن تا همه‌جا به‌روز شود
            await refresh();

            // پاک‌سازی پسوردها
            setPassword('');
            setConfirmPassword('');

            // اگر خواستی: router.push('/business')
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                'خطا در به‌روزرسانی پروفایل';
            setErrors({server: msg});
        } finally {
            setSaving(false);
        }
    };

    const wrapperClass = 'w-[90%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto';

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading…</div>;
    }
    if (!user) return null;

    return (
        <div>
            <div>
                <form onSubmit={handleSubmit} dir="rtl" className="flex flex-col w-full min-h-screen items-center justify-center gap-4 font-sans bg-background text-foreground">
                    <h2 className="text-2xl font-semibold mb-4 text-center">پروفایل</h2>

                    {/* Username فقط نمایشی */}
                    <Input
                        label="نام کاربری"
                        name="username"
                        value={username}
                        containerClass={cn(wrapperClass)}
                        inputClass="w-full h-[40px]"
                        onChange={() => {
                        }}
                        disabled
                    />

                    <Input
                        label="نام و نام خانوادگی"
                        name="fullname"
                        value={fullname}
                        containerClass={cn(wrapperClass, 'mt-3')}
                        inputClass="w-full h-[40px]"
                        onChange={(e) => setFullname(e.target.value)}
                    />
                    {errors.fullname && <p className="text-sm text-red-500 mt-1">{errors.fullname}</p>}

                    <Input
                        label="کد ملی"
                        name="nationalCode"
                        value={nationalCode}
                        containerClass={cn(wrapperClass, 'mt-3')}
                        inputClass="w-full h-[40px]"
                        onChange={(e) => setNationalCode(e.target.value)}
                    />
                    {errors.nationalCode && <p className="text-sm text-red-500 mt-1">{errors.nationalCode}</p>}

                    <Input
                        label="نقش"
                        name="role"
                        value={role}
                        containerClass={cn(wrapperClass, 'mt-3')}
                        inputClass="w-full h-[40px]"
                        onChange={(e) => setRole(e.target.value)}
                    />

                    {/* پسورد اختیاری */}
                    <Input
                        label="رمز عبور جدید (اختیاری)"
                        name="password"
                        type="password"
                        value={password}
                        containerClass={cn(wrapperClass, 'mt-3')}
                        inputClass="w-full h-[40px]"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}

                    <Input
                        label="تایید رمز عبور"
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        containerClass={cn(wrapperClass, 'mt-3')}
                        inputClass="w-full h-[40px]"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errors.confirm && <p className="text-sm text-red-500 mt-1">{errors.confirm}</p>}

                    {errors.server && (
                        <p className="text-sm text-red-600 mt-3 text-center">{errors.server}</p>
                    )}

                    <div className={cn(wrapperClass, 'mt-6')}>
                        <Button
                            type="submit"
                            label={saving ? 'در حال ذخیره…' : 'ذخیره تغییرات'}
                            customStyle="w-full h-[40px] text-base disabled:opacity-60"
                            disabled={saving}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}