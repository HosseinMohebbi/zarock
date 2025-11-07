'use client';

import React, {useEffect, useMemo, useState} from 'react';
import {useRouter} from 'next/navigation';
import {cn} from '@/utils/cn';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';
import ThemeToggle from '@/app/components/theme/ThemeToggle';
import {updateUser, type UpdateUserResponse} from '@/services/auth';
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


// 'use client';
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { cn } from '@/utils/cn';
// import Input from '@/app/components/ui/Input';
// import Button from '@/app/components/ui/Button';
// import ThemeToggle from '@/app/components/theme/ThemeToggle';
// import { getUser, updateUser, type GetUserResponse, type UpdateUserResponse } from '@/services/auth';
//
// type Errors = Partial<{
//     username: string;
//     fullname: string;
//     nationalCode: string;
//     password: string;
//     confirm: string;
//     server: string;
// }>;
//
// export default function ProfilePage(): JSX.Element {
//     const router = useRouter();
//
//     // stateهای نمایش/ویرایش
//     const [username, setUsername] = useState<string>('');
//     const [fullname, setFullname] = useState<string>('');
//     const [nationalCode, setNationalCode] = useState<string>('');
//     const [role, setRole] = useState<string>('Normal');
//
//     const [password, setPassword] = useState<string>('');
//     const [confirmPassword, setConfirmPassword] = useState<string>('');
//
//     // برای تشخیص تغییرات
//     const [initial, setInitial] = useState<GetUserResponse | null>(null);
//
//     const [errors, setErrors] = useState<Errors>({});
//     const [loading, setLoading] = useState<boolean>(false);
//     const [fetching, setFetching] = useState<boolean>(true);
//
//     // واکشی اطلاعات کاربر در بدو ورود
//     useEffect(() => {
//         let active = true;
//         (async () => {
//             try {
//                 const data = await getUser(); // { username, fullname, role, nationalCode }
//                 if (!active) return;
//                 setInitial(data);
//                 setUsername(data.username);
//                 setFullname(data.fullname);
//                 setNationalCode(data.nationalCode);
//                 setRole(data.role || 'Normal');
//             } catch (err: any) {
//                 const msg =
//                     err?.response?.data?.message ||
//                     err?.response?.data?.error ||
//                     err?.message ||
//                     'خطا در دریافت اطلاعات کاربر';
//                 setErrors({ server: msg });
//             } finally {
//                 if (active) setFetching(false);
//             }
//         })();
//         return () => {
//             active = false;
//         };
//     }, []);
//
//     const validate = (): Errors => {
//         const e: Errors = {};
//         // ویرایش اختیاری است؛ فقط پسورد اگر وارد شد چک می‌شود:
//         if (password) {
//             if (password.length < 6) e.password = 'رمز باید حداقل 6 کاراکتر باشد';
//             if (password !== confirmPassword) e.confirm = 'تایید رمز برابر نیست';
//         }
//         return e;
//     };
//
//     const handleSubmit = async (ev: React.FormEvent) => {
//         ev.preventDefault();
//         setErrors({});
//
//         const e = validate();
//         if (Object.keys(e).length > 0) {
//             setErrors(e);
//             return;
//         }
//
//         // فقط فیلدهایی که تغییر کرده‌اند/پُر شده‌اند را بفرست
//         const payload: Record<string, any> = {};
//         if (initial) {
//             if (fullname && fullname !== initial.fullname) payload.fullname = fullname;
//             if (nationalCode && nationalCode !== initial.nationalCode) payload.nationalCode = nationalCode;
//             if (role && role !== initial.role) payload.role = role;
//         } else {
//             // اگر initial به هر دلیلی نبود، هر چیزی که پر شده را بفرست
//             if (fullname) payload.fullname = fullname;
//             if (nationalCode) payload.nationalCode = nationalCode;
//             if (role) payload.role = role;
//         }
//         if (password) payload.password = password;
//
//         // اگر هیچ چیزی برای ارسال نیست، خروج
//         if (Object.keys(payload).length === 0) {
//             router.push('/business')
//             // setErrors({ server: 'تغییری برای ذخیره وجود ندارد.' });
//             // return;
//         }
//
//         setLoading(true);
//         try {
//             const res: UpdateUserResponse = await updateUser(payload);
//             // بعد از موفقیت، initial را به مقادیر جدید به‌روزرسانی کن
//             const updated: GetUserResponse = {
//                 username: res.username ?? username,
//                 fullname: res.fullname ?? fullname,
//                 role: res.roles ?? role, // در پاسخ شما roles هست؛ اگر بک‌اند role برگرداند، این خط را مطابق آن اصلاح کن
//                 nationalCode: res.nationalCode ?? nationalCode,
//             };
//             setInitial(updated);
//             setUsername(updated.username);
//             setFullname(updated.fullname);
//             setNationalCode(updated.nationalCode);
//             setRole(updated.role);
//
//             // پاک کردن فیلدهای پسورد
//             setPassword('');
//             setConfirmPassword('');
//         } catch (err: any) {
//             const msg =
//                 err?.response?.data?.message ||
//                 err?.response?.data?.error ||
//                 err?.message ||
//                 'خطا در به‌روزرسانی پروفایل';
//             setErrors({ server: msg });
//         } finally {
//             setLoading(false);
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
//             <form onSubmit={handleSubmit} dir="rtl" className="w-full">
//                 <h2 className="text-2xl font-semibold mb-4 text-center">پروفایل</h2>
//
//                 {/* Username فقط نمایشی (غیرفعال) */}
//                 <Input
//                     label="نام کاربری"
//                     name="username"
//                     value={username}
//                     containerClass={cn(wrapperClass)}
//                     inputClass="w-full h-[40px]"
//                     onChange={() => {}}
//                     disabled
//                 />
//
//                 <Input
//                     label="نام و نام خانوادگی"
//                     name="fullname"
//                     value={fullname}
//                     containerClass={cn(wrapperClass, 'mt-3')}
//                     inputClass="w-full h-[40px]"
//                     onChange={(e) => setFullname(e.target.value)}
//                 />
//                 {errors.fullname && <p className="text-sm text-red-500 mt-1">{errors.fullname}</p>}
//
//                 <Input
//                     label="کد ملی"
//                     name="nationalCode"
//                     value={nationalCode}
//                     containerClass={cn(wrapperClass, 'mt-3')}
//                     inputClass="w-full h-[40px]"
//                     onChange={(e) => setNationalCode(e.target.value)}
//                 />
//                 {errors.nationalCode && <p className="text-sm text-red-500 mt-1">{errors.nationalCode}</p>}
//
//                 {/* نقش (دلخواه) */}
//                 <Input
//                     label="نقش"
//                     name="role"
//                     value={role}
//                     containerClass={cn(wrapperClass, 'mt-3')}
//                     inputClass="w-full h-[40px]"
//                     onChange={(e) => setRole(e.target.value)}
//                 />
//
//                 {/* پسورد اختیاری */}
//                 <Input
//                     label="رمز عبور جدید (اختیاری)"
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
//                 {errors.server && (
//                     <p className="text-sm text-red-600 mt-3 text-center">{errors.server}</p>
//                 )}
//
//                 <div className={cn(wrapperClass, 'mt-6')}>
//                     <Button
//                         type="submit"
//                         label={loading ? 'در حال ذخیره…' : 'ذخیره تغییرات'}
//                         customStyle="w-full h-[40px] text-base disabled:opacity-60"
//                         disabled={loading || fetching}
//                     />
//                 </div>
//             </form>
//         </div>
//     );
// }

// 'use client';
// import React, {useState} from 'react';
// import {useRouter} from 'next/navigation';
// import {cn} from '@/utils/cn';
// import Input from '@/app/components/ui/Input';
// import Button from '@/app/components/ui/Button';
// import ThemeToggle from '@/app/components/theme/ThemeToggle';
// import {registerUser, updateUser, type RegisterResponse, UpdateUserResponse} from '@/services/auth'; // ⬅️ سرویس ما
//
// type Errors = Partial<{
//     username: string;
//     fullname: string;
//     nationalCode: string;
//     password: string;
//     confirm: string;
//     server: string;
// }>;
//
// const profile = ()=> {
//     const router = useRouter();
//
//     const [username, setUsername] = useState<string>('');
//     const [fullname, setFullname] = useState<string>('');
//     const [nationalCode, setNationalCode] = useState<string>('');
//     const [password, setPassword] = useState<string>('');
//     const [confirmPassword, setConfirmPassword] = useState<string>('');
//     const [role, setRole] = useState('Normal')
//     const [errors, setErrors] = useState<Errors>({});
//     const [loading, setLoading] = useState<boolean>(false);
//
//     const validate = (): Errors => {
//         const e: Errors = {};
//         if (!fullname.trim()) e.fullname = 'نام و نام خانوادگی لازم است';
//         if (!nationalCode.trim()) e.nationalCode = 'کد ملی لازم است';
//         if (password.length < 6) e.password = 'رمز باید حداقل ۸ کاراکتر باشد';
//         if (password !== confirmPassword) e.confirm = 'تایید رمز برابر نیست';
//         return e;
//     };
//
//     const handleSubmit = async (ev: React.FormEvent) => {
//         ev.preventDefault();
//         setErrors({});
//         const e = validate();
//         if (Object.keys(e).length > 0) {
//             setErrors(e);
//             return;
//         }
//
//         setLoading(true);
//         try {
//             // ⬅️ فراخوانی سرویس
//             const res: UpdateUserResponse = await updateUser({
//                 fullname,
//                 nationalCode,
//                 password,
//                 role,
//             });
//
//             // ذخیره توکن/انقضا (در صورت نیاز)
//             if (typeof window !== 'undefined') {
//                 localStorage.setItem('auth_token', res.token);
//                 localStorage.setItem('auth_expires', res.expires);
//             }
//
//             // ریدایرکت دلخواه
//             router.push('/login');
//             // یا اگر فقط می‌خوای فرم خالی شه:
//             setUsername('');
//             setFullname('');
//             setNationalCode('');
//             setPassword('');
//             setConfirmPassword('');
//         } catch (err: any) {
//             const msg =
//                 err?.response?.data?.message ||
//                 err?.response?.data?.error ||
//                 err?.message ||
//                 'خطا در ثبت‌نام';
//             setErrors({server: msg});
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const wrapperClass = 'w-[90%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto';
//
//     return (
//         <div
//             className="flex flex-col w-full min-h-screen items-center justify-center gap-4 font-sans bg-background text-foreground">
//             <div className="absolute top-4 left-4">
//                 <ThemeToggle/>
//             </div>
//
//             <form onSubmit={handleSubmit} dir="rtl">
//                 <h2 className="text-2xl font-semibold mb-4 text-center">ثبت‌نام</h2>
//
//                 <Input
//                     label="نام کاربری"
//                     name="username"
//                     value={username}
//                     containerClass={cn(wrapperClass)}
//                     inputClass="w-full h-[40px]"
//                     onChange={(e) => setUsername(e.target.value)}
//                 />
//                 {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username}</p>}
//
//                 <Input
//                     label="نام و نام خانوادگی"
//                     name="fullname"
//                     value={fullname}
//                     containerClass={cn(wrapperClass, 'mt-3')}
//                     inputClass="w-full h-[40px]"
//                     onChange={(e) => setFullname(e.target.value)}
//                 />
//                 {errors.fullname && <p className="text-sm text-red-500 mt-1">{errors.fullname}</p>}
//
//                 <Input
//                     label="کد ملی"
//                     name="nationalCode"
//                     value={nationalCode}
//                     containerClass={cn(wrapperClass, 'mt-3')}
//                     inputClass="w-full h-[40px]"
//                     onChange={(e) => setNationalCode(e.target.value)}   // ⬅️ قبلاً اشتباهی setName بود
//                 />
//                 {errors.nationalCode && (
//                     <p className="text-sm text-red-500 mt-1">{errors.nationalCode}</p>
//                 )}
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
//                 {errors.server && (
//                     <p className="text-sm text-red-600 mt-3 text-center">{errors.server}</p>
//                 )}
//
//                 <div className={cn(wrapperClass, 'mt-6')}>
//                     <Button
//                         type="submit"
//                         label={loading ? 'در حال ارسال…' : 'ثبت‌نام'}
//                         customStyle="w-full h-[40px] text-base disabled:opacity-60"
//                         disabled={loading}
//                     />
//                 </div>
//             </form>
//         </div>
//     );
// }
//
// export default profile;
