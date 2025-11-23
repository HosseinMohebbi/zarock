'use client';
import {useState} from "react";
import {useRouter, useParams} from "next/navigation";
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
        customStyle: "w-30 h-10 sm:w-70 sm:h-80 md:w-sm md:h-md",
        route: '/clients'
    },
    {
        title: "کالا و خدمات",
        icon: <MdInventory className="w-8 h-8 text-green-600"/>,
        customStyle: "w-30 h-10 sm:w-70 sm:h-80 md:w-sm h-md",
        route: '/items'
    },
    {
        title: "فاکتورها",
        icon: <MdReceiptLong className="w-8 h-8 text-green-600"/>,
        customStyle: "w-30 h-10 sm:w-70 sm:h-80 md:w-sm h-md",
        route: '/invoices'
    },
    {
        title: "تراکنش ها",
        icon: <MdAccountBalanceWallet className="w-8 h-8 text-green-600"/>,
        customStyle: "w-50 h-60 sm:w-70 h-80 md:w-sm h-md",
        route: '/transactions'
    },
    {
        title: "پروژه ها",
        icon: <MdWork className="w-8 h-8 text-green-600"/>,
        customStyle: "w-50 h-60 sm:w-70 h-80 md:w-sm h-md",
        route: '/projects'
    },
    {
        title: "دستی",
        icon: <MdEditNote className="w-8 h-8 text-green-600"/>,
        customStyle: "w-50 h-60 sm:w-70 h-80 md:w-sm h-md",
        route: '/clients'
    },
    {
        title: "انبار",
        icon: <MdWarehouse className="w-8 h-8 text-green-600"/>,
        customStyle: "w-50 h-60 sm:w-70 h-80 md:w-sm h-md",
        route: '/clients'
    },
    {
        title: "حقوق و دستمزد",
        icon: <MdPayments className="w-8 h-8 text-green-600"/>,
        customStyle: "w-50 h-60 sm:w-70 h-80 md:w-sm h-md",
        route: '/clients'
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
    ) => router.push(`/business/${businessId}/${route}`);


    return (
        <div className="w-full h-full">
            <div
                className="w-full h-full flex justify-center items-center !p-4 font-sans bg-background text-foreground">
                <div className="h-auto flex justify-center items-center flex-wrap gap-4 !py-6">
                    {dashboardCards.map((card, index) => (
                        <Card customStyle="w-40 h-45 sm:w-45 sm:h-50 md:w-50 md:h-55 cursor-pointer" title={card.title}
                              icon={card.icon} key={index} onClick={() => handleCardClick(card.route)}/>
                    ))}
                </div>
            </div>
            {/*<div className="flex flex-col w-full min-h-screen items-center justify-center gap-4 font-sans bg-background text-foreground">*/}
            {/*    <Card customStyle="w-80" title="تراکنش ها" icon={<MdAccountBalanceWallet className="w-8 h-8 text-green-600" />}/>*/}
            {/*</div>*/}
        </div>
    );
}

