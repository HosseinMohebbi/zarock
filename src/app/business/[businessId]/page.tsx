'use client';
import {useState} from "react";
import { useRouter, useParams } from "next/navigation";
import {cn} from "@/utils/cn";
import ThemeToggle from "@/app/components/theme/ThemeToggle";
import Card from "@/app/components/ui/Card";
import {Car, Wallet} from "lucide-react"
import {
    MdPeople,
    MdInventory,
    MdReceiptLong,
    MdAccountBalanceWallet,
    MdWork,
    MdEditNote,
    MdWarehouse,
    MdPayments
} from "react-icons/md";


const dashboardCards = [
    {
        title: "اشخاص",
        icon: <MdPeople className="w-8 h-8 text-green-600"/>,
        customStyle: "w-50 h-60 sm:w-70 h-80 md:w-sm h-md",
        route: '/clients'
    },
    {
        title: "کالا و خدمات",
        icon: <MdInventory className="w-8 h-8 text-green-600"/>,
        customStyle: "w-50 h-60 sm:w-70 h-80 md:w-sm h-md"
    },
    {
        title: "فاکتورها",
        icon: <MdReceiptLong className="w-8 h-8 text-green-600"/>,
        customStyle: "w-50 h-60 sm:w-70 h-80 md:w-sm h-md"
    },
    {
        title: "تراکنش ها",
        icon: <MdAccountBalanceWallet className="w-8 h-8 text-green-600"/>,
        customStyle: "w-50 h-60 sm:w-70 h-80 md:w-sm h-md"
    },
    {
        title: "پروژه ها",
        icon: <MdWork className="w-8 h-8 text-green-600"/>,
        customStyle: "w-50 h-60 sm:w-70 h-80 md:w-sm h-md"
    },
    {
        title: "دستی",
        icon: <MdEditNote className="w-8 h-8 text-green-600"/>,
        customStyle: "w-50 h-60 sm:w-70 h-80 md:w-sm h-md"
    },
    {
        title: "انبار",
        icon: <MdWarehouse className="w-8 h-8 text-green-600"/>,
        customStyle: "w-50 h-60 sm:w-70 h-80 md:w-sm h-md"
    },
    {
        title: "حقوق و دستمزد",
        icon: <MdPayments className="w-8 h-8 text-green-600"/>,
        customStyle: "w-50 h-60 sm:w-70 h-80 md:w-sm h-md"
    },
]

export default function Home() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const router = useRouter();
    const params = useParams() as { businessId?: string };
    const businessId = params.businessId ?? '';
    console.log(businessId);

    const handleCardClick = (route: string
    ) => router.push(`/${route}/${businessId}`);


    return (
        <div className="w-full h-full">
            <div
                className="w-full h-full flex justify-center items-center font-sans bg-background text-foreground">
                <div className="w-[90%] h-auto bg-green-400 flex justify-center items-center flex-wrap gap-4 !py-6">
                    {dashboardCards.map((card, index) => (
                        <div key={index} onClick={() => handleCardClick(card.route)}
                        >
                            <Card customStyle={card.customStyle} title={card.title} icon={card.icon}/>
                        </div>
                    ))}
                </div>
            </div>
            {/*<div className="flex flex-col w-full min-h-screen items-center justify-center gap-4 font-sans bg-background text-foreground">*/}
            {/*    <Card customStyle="w-80" title="تراکنش ها" icon={<MdAccountBalanceWallet className="w-8 h-8 text-green-600" />}/>*/}
            {/*</div>*/}
        </div>
    );
}

