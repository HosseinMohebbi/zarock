'use client';
import {useState} from "react";
import { cn } from "@/utils/cn";
import Input from "./components/ui/Input";
import Button from "@/app/components/ui/Button";
import Card from "@/app/components/ui/Card";
import {Wallet} from "lucide-react"
import LoginPage from "@/app/(auth)/login/page"
import { MdAccountBalanceWallet } from "react-icons/md";

export default function Home() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    return (
        <div>
            <LoginPage/>
            {/*<ThemeToggle/>*/}
            {/*<div className="flex flex-col w-full min-h-screen items-center justify-center gap-4 font-sans bg-background text-foreground">*/}
            {/*    <Input*/}
            {/*        label="نام کاربری"*/}
            {/*        name="username"*/}
            {/*        value={name}*/}
            {/*        containerClass={cn('w-[90%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto')}*/}
            {/*        inputClass={cn('w-full h-[40px]')}*/}
            {/*        onChange={(e) => setName(e.target.value)}*/}
            {/*    />*/}
            
            {/*    <Input*/}
            {/*        label="رمز عبور"*/}
            {/*        name="password"*/}
            {/*        type="password"*/}
            {/*        containerClass={cn('w-[90%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto')}*/}
            {/*        inputClass={cn('w-full h-[40px]')}*/}
            {/*        onChange={(e) => setEmail(e.target.value)}*/}
            {/*    />*/}
            
            {/*    <div className="w-[90%] sm:w-[80%] md:w-[60%] max-w-lg mx-auto">*/}
            {/*        <Button*/}
            {/*            type='submit'*/}
            {/*            label='submit'*/}
            {/*            customStyle='p-[6.2px] h-fit w-[100%] h-[40px] text-[22px] hover:bg-green-700'*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*    <Card customStyle="w-80" title="تراکنش ها" icon={<MdAccountBalanceWallet className="w-8 h-8 text-green-600" />}/>*/}
            {/*</div>*/}
        </div>
    );
}
