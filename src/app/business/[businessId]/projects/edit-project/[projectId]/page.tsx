'use client';
import { useState } from "react";
import DocumentsForm from "./DocumentsForm";
import TransactionForm from "./TransactionForm";
import InvoicesForm from "./InvoicesForm";
import ProjectInfoForm from "./ProjectInfoForm";
import Button from "@/app/components/ui/Button";

export default function EditProjectWrapper() {
    
    const [activeTab, setActiveTab] = useState<'info' | 'transactions' | 'invoices' | 'documents'>('info');

    return (
        <div className="w-full flex flex-col items-center !px-4 !pb-6 !pt-24 h-screen overflow-hidden">
            <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
                
                <div className="flex justify-center gap-3 !mb-6 flex-wrap shrink-0">
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

                <div className="w-full flex-1 overflow-hidden">
                    <div className={activeTab === 'info' ? 'block h-full' : 'hidden'}>
                        <ProjectInfoForm/>
                    </div>

                    <div className={activeTab === 'transactions' ? 'block h-full' : 'hidden'}>
                        <TransactionForm/>
                    </div>

                    <div className={activeTab === 'invoices' ? 'block h-full' : 'hidden'}>
                        <InvoicesForm/>
                    </div>

                    <div className={activeTab === 'documents' ? 'block h-full' : 'hidden'}>
                        <DocumentsForm/>
                    </div>
                </div>
            </div>
        </div>
    );
}
