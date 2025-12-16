'use client';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchBankLogos,
    fetchBankAccounts,
    addBankAccount,
    editBankAccount,
    removeBankAccount,
    selectBankAccounts,
    selectBankLogos,
    selectBankLoading,
    selectBankError
} from "@/app/store/bankAccountsSlice";
import {AppDispatch, RootState} from "@/app/store/store"

import Button from "@/app/components/ui/Button";
import Card from "@/app/components/ui/Card";
import { BankAccountModal } from "@/app/components/ui/modals/BankAccountModal";
import ConfirmModal from "@/app/components/ui/ConfirmModal";

import { BankLogo, BankAccountResponse } from "@/services/client/client.types";
import { MdAdd } from "react-icons/md";
import { toast } from "react-toastify";

type Props = {
    businessId: string;
    clientId: string;
};

export default function ClientBankAccountsForm({ businessId, clientId }: Props) {
    const dispatch = useDispatch<AppDispatch>();

    // redux states
    const logos = useSelector((state: RootState) => selectBankLogos(state));
    const bankAccounts = useSelector((state: RootState) => selectBankAccounts(state));
    const accountsLoading = useSelector((state: RootState) => selectBankLoading(state));
    const accountsError = useSelector((state: RootState) => selectBankError(state));

    const [editingAccount, setEditingAccount] = useState<BankAccountResponse | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedBankAccountId, setSelectedBankAccountId] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchBankLogos());
        dispatch(fetchBankAccounts({ businessId, clientId }));
    }, [businessId, clientId]);

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

    async function handleModalSubmit(data: any) {
        const payload = {
            bankName: data.selectedBank.name,
            accountNumber: data.accountNumber,
            cardNumber: data.cardNumber,
            shaBaCode: data.shaBaCode,
        };

        try {
            if (editingAccount) {
                await dispatch(
                    editBankAccount({
                        businessId,
                        clientId,
                        accountId: editingAccount.id,
                        payload,
                    }) as any
                );
                toast.success("حساب بانکی با موفقیت ویرایش شد");
            } else {
                await dispatch(
                    addBankAccount({
                        businessId,
                        clientId,
                        payload,
                    }) as any
                );
                toast.success("حساب بانکی با موفقیت اضافه شد");
            }
        } finally {
            setModalOpen(false);
        }
    }

    function handleDelete(accountId: string) {
        setSelectedBankAccountId(accountId);
        setShowConfirm(true);
    }

    async function confirmDelete() {
        if (!selectedBankAccountId) return;

        await dispatch(
            removeBankAccount({
                businessId,
                accountId: selectedBankAccountId,
                clientId,
            }) as any
        );

        setShowConfirm(false);
    }

    return (
        <div className="w-full max-w-lg !mx-auto !p-6 bg-background text-foreground !rounded-lg shadow">
            <div className="flex items-center justify-between !mb-4">
                <h3 className="text-md font-semibold">حساب‌های بانکی</h3>
                <Button
                    type="button"
                    onClick={handleAddNewAccount}
                    customStyle="flex items-center gap-2 !px-3 !py-2 !bg-primary"
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
                    {bankAccounts.map((acc: any) => {
                        const logo = logos.find(
                            (l: BankLogo) =>
                                l.name?.toLowerCase() === acc.bankName?.toLowerCase()
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

                                <div className="flex justify-end gap-2 !mt-3">
                                    <Button
                                        label="حذف"
                                        onClick={() => handleDelete(acc.id)}
                                        customStyle="!px-3 !py-1 text-sm !rounded-md !bg-danger text-white"
                                    />
                                    <Button
                                        label="ویرایش"
                                        onClick={() => handleEditAccount(acc)}
                                        customStyle="!px-3 !py-1 text-sm !rounded-md !bg-confirm text-white"
                                    />
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            <ConfirmModal
                title="حذف حساب بانکی"
                isOpen={showConfirm}
                message="آیا از حذف این حساب مطمئن هستید؟ این عملیات غیر قابل بازگشت است."
                onConfirm={confirmDelete}
                onCancel={() => setShowConfirm(false)}
            />

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

