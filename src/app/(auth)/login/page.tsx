"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {cn} from "@/utils/cn";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import ThemeToggle from "@/app/components/theme/ThemeToggle";
import {loginUser, type LoginResponse} from "@/services/auth";
import { useUser } from '@/context/UserContext';

type Errors = Partial<{ userName: string; password: string; server: string }>;

export default function LoginPage(): JSX.Element {
    const router = useRouter();
    const {refresh} = useUser();

    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errors, setErrors] = useState<Errors>({});
    const [loading, setLoading] = useState<boolean>(false);

    const validate = (): Errors => {
        const e: Errors = {};
        if (!userName.trim()) e.userName = "نام کاربری لازم است";
        if (password.length < 1) e.password = "رمز عبور لازم است";
        return e;
    };

    const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        setErrors({});
        const e = validate();
        if (Object.keys(e).length) {
            setErrors(e);
            return;
        }
        setLoading(true);
        try {
            const res: LoginResponse = await loginUser({userName, password});
            if (typeof window !== "undefined") {
                localStorage.setItem("auth_token", res.token);
                localStorage.setItem("auth_expires", res.expires);
            }
            // ریدایرکت دلخواه:
            await refresh();
            router.push("/business");
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "خطا در ورود";
            setErrors({server: msg});
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="w-full h-screen">
                <form onSubmit={onSubmit} dir="rtl" className="w-full h-full flex flex-col justify-center items-center gap-4  font-sans bg-background text-foreground">
                    <h2 className="text-2xl font-semibold mb-4 text-center">ورود</h2>
                    <Input
                        label="نام کاربری"
                        name="username"
                        value={userName}
                        containerClass={cn('w-[90%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto')}
                        inputClass={cn('w-full h-[40px]')}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    {errors.userName && (
                        <p className="text-sm text-red-500 mt-1">{errors.userName}</p>
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
                    {errors.password && (
                        <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                    )}

                    {errors.server && (
                        <p className="text-sm text-red-600 mt-3 text-center">{errors.server}</p>
                    )}

                    <div className="w-[90%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto">
                        <Button
                            type="submit"
                            label={loading ? "در حال ارسال…" : "ورود"}
                            disabled={loading}
                            customStyle='p-[6.2px] h-fit w-[100%] h-[40px] text-[22px] hover:bg-green-700 !mt-6'
                        />
                    </div>
                        <Link
                            href="/signup"
                            className="text-md"
                        >
                            حساب کاربری ندارید؟ ثبت نام کنید
                        </Link>
                </form>
        </div>
    );
}

// 'use client';
// import {useState} from "react";
// import { cn } from "@/utils/cn";
// import Input from "@/app/components/ui/Input";
// import Button from "@/app/components/ui/Button";
// import ThemeToggle from "@/app/components/theme/ThemeToggle";
//
// export default function Home() {
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     return (
//         <div>
//             <ThemeToggle/>
//             <div className="flex flex-col w-full min-h-screen items-center justify-center gap-4 font-sans bg-background text-foreground">
//                 <Input
//                     label="نام کاربری"
//                     name="username"
//                     value={name}
//                     containerClass={cn('w-[80%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto')}
//                     inputClass={cn('w-full h-[40px]')}
//                     onChange={(e) => setName(e.target.value)}
//                 />
//
//                 <Input
//                     label="رمز عبور"
//                     name="password"
//                     type="password"
//                     containerClass={cn('w-[80%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto')}
//                     inputClass={cn('w-full h-[40px]')}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />
//
//                 <div className="w-[80%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto">
//                     <Button
//                         type='submit'
//                         label='submit'
//                         customStyle='p-[6.2px] h-fit w-[100%] h-[40px] text-[22px]'
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// }