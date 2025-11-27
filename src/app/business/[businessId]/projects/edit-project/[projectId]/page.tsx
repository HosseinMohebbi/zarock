'use client';

import { useState } from "react";
import { useParams } from "next/navigation";
import ClientInfoForm from "./ClientInfoForm";
import ClientTransactions from "./ClientTransactions";
import ClientInvoices from "./ClientInvoices";
import ClientDocuments from "./ClientDocuments";
import Button from "@/app/components/ui/Button";

export default function ClientDetailsPage() {
    const params = useParams() as { businessId?: string; clientId?: string };
    const businessId = params.businessId ?? '';
    const clientId = params.clientId ?? '';

    const [activeTab, setActiveTab] = useState<'info' | 'transactions' | 'invoices' | 'documents'>('info');

    if (!businessId || !clientId) {
        return (
            <div className="flex justify-center items-center h-screen">
                شناسه کسب‌وکار یا مشتری نامعتبر است
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center !px-4 !pb-6 !pt-24">
            <div className="w-full max-w-4xl mx-auto">

                {/* تب‌ها */}
                <div className="flex justify-center gap-3 !mb-6 flex-wrap">
                    <Button
                        type="button"
                        label="اطلاعات"
                        onClick={() => setActiveTab('info')}
                        customStyle={`!px-4 !py-2 !rounded-md text-sm font-medium border transition
                        ${activeTab === 'info'
                            ? '!bg-primary !text-primary-foreground'
                            : '!bg-muted !text-muted-foreground'}`}
                    />

                    <Button
                        type="button"
                        label="تراکنش‌ها"
                        onClick={() => setActiveTab('transactions')}
                        customStyle={`!px-4 !py-2 !rounded-md text-sm font-medium border transition
                        ${activeTab === 'transactions'
                            ? '!bg-primary !text-primary-foreground'
                            : '!bg-muted !text-muted-foreground'}`}
                    />

                    <Button
                        type="button"
                        label="فاکتورها"
                        onClick={() => setActiveTab('invoices')}
                        customStyle={`!px-4 !py-2 !rounded-md text-sm font-medium border transition
                        ${activeTab === 'invoices'
                            ? '!bg-primary !text-primary-foreground'
                            : '!bg-muted !text-muted-foreground'}`}
                    />

                    <Button
                        type="button"
                        label="اسناد"
                        onClick={() => setActiveTab('documents')}
                        customStyle={`!px-4 !py-2 !rounded-md text-sm font-medium border transition
                        ${activeTab === 'documents'
                            ? '!bg-primary !text-primary-foreground'
                            : '!bg-muted !text-muted-foreground'}`}
                    />
                </div>

                {/* محتوای تب‌ها */}
                <div className="w-full">
                    <div className={activeTab === 'info' ? 'block' : 'hidden'}>
                        <ClientInfoForm businessId={businessId} clientId={clientId}/>
                    </div>

                    <div className={activeTab === 'transactions' ? 'block' : 'hidden'}>
                        <ClientTransactions businessId={businessId} clientId={clientId}/>
                    </div>

                    <div className={activeTab === 'invoices' ? 'block' : 'hidden'}>
                        <ClientInvoices businessId={businessId} clientId={clientId}/>
                    </div>

                    <div className={activeTab === 'documents' ? 'block' : 'hidden'}>
                        <ClientDocuments businessId={businessId} clientId={clientId}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
