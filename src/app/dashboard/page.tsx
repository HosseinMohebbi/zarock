'use client';
import {useState} from "react";
import {cn} from "@/utils/cn";
import Input from "./components/ui/Input";
import Button from "@/app/components/ui/Button";
import ThemeToggle from "@/app/components/theme/ThemeToggle";
import Card from "@/app/components/ui/Card";
import {Car, Wallet} from "lucide-react"
import {MdPeople, MdInventory, MdReceiptLong, MdAccountBalanceWallet, MdWork, MdEditNote, MdWarehouse, MdPayments } from "react-icons/md";

const dashboardCards = [
    {
        title: "اشخاص",
        icon: <MdPeople className="w-8 h-8 text-green-600"/>,
        customStyle: "w-80"
    },
    {
        title: "کالا و خدمات",
        icon: <MdInventory className="w-8 h-8 text-green-600"/>,
        customStyle: "w-80"
    },
    {
        title: "فاکتورها",
        icon: <MdReceiptLong className="w-8 h-8 text-green-600"/>,
        customStyle: "w-80"
    },
    {
        title: "تراکنش ها",
        icon: <MdAccountBalanceWallet className="w-8 h-8 text-green-600"/>,
        customStyle: "w-80"
    },
    {
        title: "پروژه ها",
        icon: <MdWork className="w-8 h-8 text-green-600"/>,
        customStyle: "w-80"
    },
    {
        title: "دستی",
        icon: <MdEditNote className="w-8 h-8 text-green-600"/>,
        customStyle: "w-80"
    },
    {
        title: "انبار",
        icon: <MdWarehouse className="w-8 h-8 text-green-600"/>,
        customStyle: "w-80"
    },
    {
        title: "حقوق و دستمزد",
        icon: <MdPayments className="w-8 h-8 text-green-600"/>,
        customStyle: "w-80"
    },
]

export default function Home() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    return (
        <div>
            <ThemeToggle/>
            <div
                className="flex flex-col w-full min-h-screen items-center justify-center gap-4 font-sans bg-background text-foreground">
                {dashboardCards.map((card, index) => (
                    <Card customStyle={card.customStyle} title={card.title} icon={card.icon}/>
                ))}
            </div>
            {/*<div className="flex flex-col w-full min-h-screen items-center justify-center gap-4 font-sans bg-background text-foreground">*/}
            {/*    <Card customStyle="w-80" title="تراکنش ها" icon={<MdAccountBalanceWallet className="w-8 h-8 text-green-600" />}/>*/}
            {/*</div>*/}
        </div>
    );
}

