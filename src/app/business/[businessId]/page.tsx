'use client';
import {useRouter, useParams} from "next/navigation";
import Card from "@/app/components/ui/Card";
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
        icon: <MdPeople className="w-8 h-8 text-primary"/>,
        customStyle: "w-40 h-45 sm:w-45 sm:h-50 md:w-50 md:h-55 cursor-pointer ",
        route: '/clients'
    },
    {
        title: "کالا و خدمات",
        icon: <MdInventory className="w-8 h-8 text-primary"/>,
        customStyle: "w-40 h-45 sm:w-45 sm:h-50 md:w-50 md:h-55 cursor-pointer ",
        route: '/items'
    },
    {
        title: "فاکتورها",
        icon: <MdReceiptLong className="w-8 h-8 text-primary"/>,
        customStyle: "w-40 h-45 sm:w-45 sm:h-50 md:w-50 md:h-55 cursor-pointer ",
        route: '/invoices'
    },
    {
        title: "تراکنش ها",
        icon: <MdAccountBalanceWallet className="w-8 h-8 text-primary"/>,
        customStyle: "w-40 h-45 sm:w-45 sm:h-50 md:w-50 md:h-55 cursor-pointer ",
        route: '/transactions'
    },
    {
        title: "پروژه ها",
        icon: <MdWork className="w-8 h-8 text-primary"/>,
        customStyle: "w-40 h-45 sm:w-45 sm:h-50 md:w-50 md:h-55 cursor-pointer ",
        route: '/projects'
    },
    {
        title: "دستی",
        icon: <MdEditNote className="w-8 h-8 text-primary"/>,
        customStyle: "w-40 h-45 sm:w-45 sm:h-50 md:w-50 md:h-55 !bg-muted",
        route: '/clients'
    },
    {
        title: "انبار",
        icon: <MdWarehouse className="w-8 h-8 text-primary"/>,
        customStyle: "w-40 h-45 sm:w-45 sm:h-50 md:w-50 md:h-55 !bg-muted",
        route: '/clients'
    },
    {
        title: "حقوق و دستمزد",
        icon: <MdPayments className="w-8 h-8 text-primary"/>,
        customStyle: "w-40 h-45 sm:w-45 sm:h-50 md:w-50 md:h-55 !bg-muted",
        route: '/clients'
    },
]

export default function Home() {
    const router = useRouter();
    const params = useParams() as { businessId?: string };
    const businessId = params.businessId ?? '';
    console.log(businessId);

    const handleCardClick = (route: string
    ) => router.push(`/business/${businessId}/${route}`);


    return (
        <div className="w-full h-full !pt-16">
            <div className="w-full h-full flex flex-col font-sans bg-background text-foreground">
                <div className="flex-grow overflow-y-auto !p-4 flex flex-wrap justify-center items-start gap-4">
                    {dashboardCards.map((card, index) => (
                        <Card
                            key={index}
                            title={card.title}
                            icon={card.icon}
                            customStyle={card.customStyle}
                            onClick={() => handleCardClick(card.route)}
                        />
                    ))}
                </div>
            </div>
        </div>
        // <div className="w-full h-full !pt-16">
        //     <div
        //         className="w-full h-full flex justify-center items-center !p-4 font-sans bg-background text-foreground">
        //         <div className="h-auto flex justify-center items-center flex-wrap gap-4 !py-6">
        //             {dashboardCards.map((card, index) => (
        //                 <Card customStyle="w-40 h-45 sm:w-45 sm:h-50 md:w-50 md:h-55 cursor-pointer" title={card.title}
        //                       icon={card.icon} key={index} onClick={() => handleCardClick(card.route)}/>
        //             ))}
        //         </div>
        //     </div>
        // </div>
    );
}

