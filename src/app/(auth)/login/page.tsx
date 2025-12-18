"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {cn} from "@/utils/cn";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import {loginUser} from "@/services/auth/auth.service";
import {LoginPayload, LoginResponse} from "@/services/auth/auth.types";
import {loginValidate} from '@/services/auth/auth.validation'
import {useUser} from '@/context/UserContext';
import {toast} from "react-toastify";


type FormState = {
    userName: string
    password: string
}

export default function LoginPage(): JSX.Element {
    const router = useRouter();
    const {refresh} = useUser();
    
    const [form, setForm] = useState<FormState>({
        userName: '',
        password: '',
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)
    
    const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        setErrors({});
        const v = loginValidate(form);
        if (Object.keys(v).length) {
            setErrors(v)
            return
        }

        setLoading(true);
        setErrors({});
        try {
            const payload: LoginPayload = {
                userName: form.userName.trim(),
                password: form.password.trim(),
            }

            const res: LoginResponse = await loginUser(payload);
            if (typeof window !== "undefined") {
                localStorage.setItem("auth_token", res.token);
                localStorage.setItem("auth_expires", res.expires);
            }
            
            await refresh();

            router.push("/business");
            toast.success("با موفقیت وارد شدید");
        } catch (err: any) {
            const status = err?.response?.status;

            if (status === 401) {
                setErrors({
                    server: "نام کاربری یا رمز عبور اشتباه است",
                });
            } else {
                setErrors({
                    server:
                        err?.response?.data?.message ||
                        err?.response?.data?.error ||
                        "خطا در ورود",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const update = (key: string, value: any) => {
        setForm(prev => ({...prev, [key]: value}));
    };

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <form onSubmit={onSubmit} dir="rtl"
                  className="w-full h-full flex flex-col justify-center items-center gap-4  font-sans bg-background text-foreground">
                <h2 className="!text-2xl !font-bold mb-4 text-center">ورود</h2>
                
                <Input
                    label="نام کاربری"
                    name="username"
                    value={form.userName}
                    containerClass={cn('w-[90%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto')}
                    inputClass={cn('w-full h-[40px]')}
                    onChange={(e) => update("userName", e.target.value)}
                    error={errors.userName}
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
                {errors.server && (
                    <p className="text-sm text-red-600 mt-2 text-center">
                        {errors.server}
                    </p>
                )}

                <div className="w-[90%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto">
                    <Button
                        type="submit"
                        label="ورود"
                        disabled={loading}
                        customStyle='p-[6.2px] h-fit w-[100%] h-[40px] text-[22px] !mt-6'
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