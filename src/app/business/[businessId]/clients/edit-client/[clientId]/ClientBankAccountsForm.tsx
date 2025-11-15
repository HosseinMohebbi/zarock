'use client';
import React, {useEffect, useState} from "react";
import Button from "@/app/components/ui/Button";
import Card from "@/app/components/ui/Card";
import {BankAccountModal} from "@/app/components/ui/modals/BankAccountModal";
import {
    BankLogo,
    getBankLogos,
    createBankAccount,
    updateBankAccount,
    getBankAccounts
} from "@/services/client";
import {MdAdd} from "react-icons/md";
import {toast} from "react-toastify";

interface BankAccountResponse {
    id: string;
    bankName?: string;
    accountNumber?: string;
    cardNumber?: string;
    shaBaCode?: string;
}

type Props = {
    businessId: string;
    clientId: string;
};

export default function ClientBankAccountsForm({businessId, clientId}: Props) {
    const [logos, setLogos] = useState<BankLogo[]>([]);
    const [bankAccounts, setBankAccounts] = useState<BankAccountResponse[]>([]);
    const [accountsLoading, setAccountsLoading] = useState(true);
    const [accountsError, setAccountsError] = useState<string | null>(null);

    const [editingAccount, setEditingAccount] = useState<BankAccountResponse | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    // لود لوگوها و حساب‌های بانکی
    useEffect(() => {
        async function loadData() {
            try {
                setAccountsLoading(true);
                setAccountsError(null);

                const [logosRes, accounts] = await Promise.all([
                    getBankLogos(),
                    getBankAccounts(businessId, clientId),
                ]);

                setLogos(logosRes);
                setBankAccounts(accounts ?? []);
            } catch (err: any) {
                console.error("Failed to load bank data:", err);
                setAccountsError(err?.message ?? "خطا در دریافت حساب‌های بانکی");
            } finally {
                setAccountsLoading(false);
            }
        }

        loadData();
    }, [businessId, clientId]);

    async function reloadAccounts() {
        try {
            setAccountsLoading(true);
            const accounts = await getBankAccounts(businessId, clientId);
            setBankAccounts(accounts ?? []);
            setAccountsError(null);
        } catch (err: any) {
            console.error("Failed to reload accounts:", err);
            setAccountsError("خطا در دریافت حساب‌های بانکی");
        } finally {
            setAccountsLoading(false);
        }
    }

    function handleAddNewAccount() {
        setEditingAccount(null);
        setModalOpen(true);
        setSuccess(null);
    }

    function handleEditAccount(account: BankAccountResponse) {
        setEditingAccount(account);
        setModalOpen(true);
        setSuccess(null);
    }

    async function handleModalSubmit(data: {
        selectedBank: BankLogo;
        accountNumber: string;
        cardNumber: string;
        shaBaCode: string;
    }) {
        if (!data.selectedBank) return;

        setAccountsError(null);
        setSuccess(null);

        try {
            if (editingAccount) {
                await updateBankAccount(businessId, editingAccount.id, {
                    bankName: data.selectedBank.name,
                    accountNumber: data.accountNumber,
                    cardNumber: data.cardNumber,
                    shaBaCode: data.shaBaCode,
                });
                toast.success("حساب بانکی با موفقیت ویرایش شد");
            } else {
                await createBankAccount(businessId, clientId, {
                    bankName: data.selectedBank.name,
                    accountNumber: data.accountNumber,
                    cardNumber: data.cardNumber,
                    shaBaCode: data.shaBaCode,
                });
                toast.success("حساب بانکی با موفقیت اضافه شد");
            }
            await reloadAccounts();
        } catch (err: any) {
            console.error(err);
            setAccountsError(err?.message ?? "خطا در عملیات حساب بانکی");
        } finally {
            setModalOpen(false);
        }
    }

    return (
        <div className="w-full max-w-lg !mx-auto !p-6 bg-background text-foreground !rounded-lg shadow">
            <div className="flex items-center justify-between !mb-4">
                <h3 className="text-md font-semibold">حساب‌های بانکی</h3>
                <Button
                    type="button"
                    onClick={handleAddNewAccount}
                    customStyle="flex items-center gap-2 !px-3 !py-2 bg-green-600 hover:bg-green-700"
                    label={
                        <span className="flex items-center gap-2">
                            <MdAdd className="w-5 h-5"/>
                        </span>
                    }
                />
            </div>

            {success && (
                <div className="!mb-3 text-sm">
                    <span className="inline-block !px-3 !py-1 bg-green-100 text-green-800 !rounded">
                        {success}
                    </span>
                </div>
            )}

            {accountsLoading ? (
                <div className="text-sm text-zinc-600">در حال بارگذاری حساب‌ها...</div>
            ) : accountsError ? (
                <div className="text-sm text-red-600">{accountsError}</div>
            ) : bankAccounts.length === 0 ? (
                <div className="text-sm text-zinc-500">
                    حساب بانکی ثبت نشده است.
                </div>
            ) : (
                <div className="flex flex-col gap-3 max-h-80 overflow-y-auto !p-2">
                    {bankAccounts.map((acc) => {
                        const logo = logos.find(
                            l => l.name?.toLowerCase() === acc.bankName?.toLowerCase()
                        );
                        return (
                            <Card
                                key={acc.id}
                                title={acc.bankName}
                                icon={
                                    logo?.url ? (
                                        <img
                                            src={logo.url}
                                            alt={logo.name}
                                            className="w-8 h-8 object-contain !rounded-sm"
                                        />
                                    ) : (
                                        <div
                                            className="w-8 h-8 flex items-center justify-center bg-gray-200 !rounded-sm text-xs"
                                        >
                                            {acc.bankName?.slice(0, 2)}
                                        </div>
                                    )
                                }
                            >
                                <div className="text-sm text-gray-700 leading-6">
                                    <div>
                                        شماره حساب:{' '}
                                        <span className="font-medium">
                                            {acc.accountNumber || '-'}
                                        </span>
                                    </div>
                                    <div>
                                        شماره کارت:{' '}
                                        <span className="font-medium">
                                            {acc.cardNumber || '-'}
                                        </span>
                                    </div>
                                    <div>
                                        شماره شبا:{' '}
                                        <span className="font-medium">
                                            {acc.shaBaCode || '-'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-end !mt-3">
                                    <Button
                                        label="ویرایش"
                                        onClick={() => handleEditAccount(acc)}
                                        customStyle="!px-3 !py-1 text-sm !rounded-md bg-blue-600 text-white hover:bg-blue-700"
                                    />
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* مدال حساب بانکی */}
            {modalOpen && (
                <BankAccountModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSubmit={handleModalSubmit}
                    editingAccount={editingAccount}
                    logos={logos}
                />
            )}
        </div>
    );
}
