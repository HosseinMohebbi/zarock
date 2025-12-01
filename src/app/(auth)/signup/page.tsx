'use client';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation'
import Link from 'next/link';
import {cn} from '@/utils/cn';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';
import {registerUser, type RegisterResponse} from '@/services/auth'; 

type Errors = Partial<{
    username: string;
    fullname: string;
    nationalCode: string;
    password: string;
    confirm: string;
    server: string;
}>;

export default function SignupPage(): JSX.Element {
    const router = useRouter();

    const [username, setUsername] = useState<string>('');
    const [fullname, setFullname] = useState<string>('');        // قبلاً name بود و مثل ایمیل ولید می‌شد!
    const [nationalCode, setNationalCode] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [errors, setErrors] = useState<Errors>({});
    const [loading, setLoading] = useState<boolean>(false);

    const validate = (): Errors => {
        const e: Errors = {};
        if (!username.trim()) e.username = 'نام کاربری لازم است';
        if (!fullname.trim()) e.fullname = 'نام و نام خانوادگی لازم است';
        if (!nationalCode.trim()) e.nationalCode = 'کد ملی لازم است';
        // اگر خواستی کد ملی رو هم ولید کنی، اینجا regex خودت رو بذار
        if (password.length < 6) e.password = 'رمز باید حداقل ۸ کاراکتر باشد';
        if (password !== confirmPassword) e.confirm = 'تایید رمز برابر نیست';
        return e;
    };

    const handleSubmit = async (ev: React.FormEvent) => {
        ev.preventDefault();
        setErrors({});
        const e = validate();
        if (Object.keys(e).length > 0) {
            setErrors(e);
            return;
        }

        setLoading(true);
        try {
            // ⬅️ فراخوانی سرویس
            const res: RegisterResponse = await registerUser({
                userName: username,
                fullname,
                nationalCode,
                password,
            });

            // ذخیره توکن/انقضا (در صورت نیاز)
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth_token', res.token);
                localStorage.setItem('auth_expires', res.expires);
            }

            // ریدایرکت دلخواه
            router.push('/login');
            // یا اگر فقط می‌خوای فرم خالی شه:
            setUsername('');
            setFullname('');
            setNationalCode('');
            setPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                'خطا در ثبت‌نام';
            setErrors({server: msg});
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} dir="rtl"
                  className="flex flex-col w-full min-h-screen items-center justify-center gap-4 font-sans bg-background text-foreground">
                <h2 className="!text-3xl !font-bold mb-4 text-center">ثبت‌نام</h2>

                <Input
                    label="نام کاربری"
                    name="username"
                    value={username}
                    containerClass={cn('w-[90%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto')}
                    inputClass={cn('w-full h-[40px]')}
                    onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username}</p>}

                <Input
                    label="نام و نام خانوادگی"
                    name="fullname"
                    value={fullname}
                    containerClass={cn('w-[90%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto')}
                    inputClass={cn('w-full h-[40px]')}
                    onChange={(e) => setFullname(e.target.value)}
                />
                {errors.fullname && <p className="text-sm text-red-500 mt-1">{errors.fullname}</p>}

                <Input
                    label="کد ملی"
                    name="nationalCode"
                    value={nationalCode}
                    containerClass={cn('w-[90%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto')}
                    inputClass={cn('w-full h-[40px]')}
                    onChange={(e) => setNationalCode(e.target.value)}   // ⬅️ قبلاً اشتباهی setName بود
                />
                {errors.nationalCode && (
                    <p className="text-sm text-red-500 mt-1">{errors.nationalCode}</p>
                )}

                <Input
                    label="رمز عبور"
                    name="password"
                    type="password"
                    value={password}
                    containerClass={cn('w-[90%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto')}
                    inputClass={cn('w-full h-[40px]')}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}

                <Input
                    label="تایید رمز عبور"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    containerClass={cn('w-[90%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto')}
                    inputClass={cn('w-full h-[40px]')}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirm && <p className="text-sm text-red-500 mt-1">{errors.confirm}</p>}

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
                <Link
                    href="/login"
                    className="text-md"
                >
                    حساب دارید؟ وارد شوید
                </Link>
            </form>
        </div>
    );
}

// 'use client';
// import React, { useState } from 'react';
// import { cn } from '@/utils/cn';
// import Input from '@/app/components/ui/Input';
// import Button from '@/app/components/ui/Button';
// import ThemeToggle from '@/app/components/theme/ThemeToggle';
//
// export default function SignupPage() {
//     const [username, setUsername] = useState('');
//     const [name, setName] = useState('');
//     const [nationalCode, setNationalCode] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [errors, setErrors] = useState<Record<string, string>>({});
//
//     const validate = () => {
//         const e: Record<string, string> = {};
//         if (!username.trim()) e.username = 'نام کاربری لازم است';
//         if (!name.trim()) e.email = 'ایمیل لازم است';
//         else if (!/^\S+@\S+\.\S+$/.test(name)) e.email = 'ایمیل معتبر نیست';
//         if (password.length < 8) e.password = 'رمز باید حداقل ۸ کاراکتر باشد';
//         if (password !== confirmPassword) e.confirm = 'تایید رمز برابر نیست';
//         return e;
//     };
//
//     const handleSubmit = (ev: React.FormEvent) => {
//         ev.preventDefault();
//         const e = validate();
//         setErrors(e);
//         if (Object.keys(e).length === 0) {
//             // Replace with real signup API call
//             console.log({ username, name, password });
//             // Clear form after successful submit (optional)
//             setUsername('');
//             setName('');
//             setPassword('');
//             setConfirmPassword('');
//         }
//     };
//
//     const wrapperClass = 'w-[90%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto';
//
//     return (
//         <div className="flex flex-col w-full min-h-screen items-center justify-center gap-4 font-sans bg-background text-foreground">
//             <div className="absolute top-4 left-4">
//                 <ThemeToggle />
//             </div>
//
//             <form
//                 onSubmit={handleSubmit}
//                 // className={cn('bg-card p-6 rounded-lg shadow-md w-full', wrapperClass)}
//                 dir="rtl"
//             >
//                 <h2 className="text-2xl font-semibold mb-4 text-center">ثبت‌نام</h2>
//
//                 <Input
//                     label="نام کاربری"
//                     name="username"
//                     value={username}
//                     containerClass={cn(wrapperClass)}
//                     // containerClass={cn('w-[80%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto')}
//                     inputClass="w-full h-[40px]"
//                     onChange={(e) => setUsername(e.target.value)}
//                 />
//                 {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username}</p>}
//
//                 <Input
//                     label="نام و نام خانوادگی"
//                     name="name"
//                     value={name}
//                     containerClass={cn(wrapperClass, 'mt-3')}
//                     inputClass="w-full h-[40px]"
//                     onChange={(e) => setName(e.target.value)}
//                 />
//                 {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
//
//                 <Input
//                     label="نام و نام خانوادگی"
//                     name="nationalCode"
//                     value={nationalCode}
//                     containerClass={cn(wrapperClass, 'mt-3')}
//                     inputClass="w-full h-[40px]"
//                     onChange={(e) => setName(e.target.value)}
//                 />
//                 {errors.nationalCode && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
//                    
//                 <Input
//                     label="رمز عبور"
//                     name="password"
//                     type="password"
//                     value={password}
//                     containerClass={cn(wrapperClass, 'mt-3')}
//                     inputClass="w-full h-[40px]"
//                     onChange={(e) => setPassword(e.target.value)}
//                 />
//                 {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
//
//                 <Input
//                     label="تایید رمز عبور"
//                     name="confirmPassword"
//                     type="password"
//                     value={confirmPassword}
//                     containerClass={cn(wrapperClass, 'mt-3')}
//                     inputClass="w-full h-[40px]"
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                 />
//                 {errors.confirm && <p className="text-sm text-red-500 mt-1">{errors.confirm}</p>}
//
//                 <div className={cn(wrapperClass, 'mt-6')}>
//                     <Button type="submit" label="ثبت‌نام" customStyle="w-full h-[40px] text-base" />
//                 </div>
//             </form>
//         </div>
//     );
// }
