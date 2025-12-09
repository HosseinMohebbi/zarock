'use client';
import {useEffect, useState} from 'react';
import Modal from "@/app/components/ui/Modal";
import Input from "@/app/components/ui/Input";
import {BankAccountResponse, BankLogo} from "@/services/client/client.types";
import Select from "@/app/components/ui/SelectInput";
interface BankAccountModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { selectedBank: BankLogo; accountNumber: string; cardNumber: string; shaBaCode: string }) => void;
    editingAccount: BankAccountResponse | null;
    logos: BankLogo[];
}

export function BankAccountModal({open, onClose, onSubmit, editingAccount, logos}: BankAccountModalProps) {
    const [accountNumber, setAccountNumber] = useState(editingAccount?.accountNumber || "");
    const [cardNumber, setCardNumber] = useState(editingAccount?.cardNumber || "");
    const [shaBaCode, setShaBaCode] = useState(editingAccount?.shaBaCode || "");
    const [selectedBank, setSelectedBank] = useState<BankLogo | null>(editingAccount ? logos.find(l => l.name === editingAccount.bankName) || logos[0] : logos[0]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        if (editingAccount) {
            setAccountNumber(editingAccount.accountNumber || "");
            setCardNumber(editingAccount.cardNumber || "");
            setShaBaCode(editingAccount.shaBaCode || "");
            const matched = logos.find(l => l.name === editingAccount.bankName);
            if (matched) setSelectedBank(matched);
        } else {
            setAccountNumber("");
            setCardNumber("");
            setShaBaCode("");
            setSelectedBank(logos[0]);
        }
    }, [editingAccount, logos]);

    const handleSubmit = () => {
        if (!selectedBank) return;
        onSubmit({selectedBank, accountNumber, cardNumber, shaBaCode});
    };

    return (
        <Modal open={open} confirmButtonTitle={editingAccount ? 'ویرایش' : 'افزودن'} onClose={onClose} onSubmit={handleSubmit}
               modalTitle={editingAccount ? "ویرایش حساب" : "افزودن حساب"}>
            <div className="space-y-3 !mt-4">
                <div>
                    <label className="block text-sm font-medium !mb-2">بانک</label>
                    <div>
                        <Select
                            label="بانک"
                            placeholder="انتخاب بانک"
                            value={selectedBank?.name || null}
                            onChange={(val) => {
                                const matched = logos.find(l => l.name === val);
                                if (matched) setSelectedBank(matched);
                            }}
                            options={logos.map(l => ({
                                value: l.name,
                                label: l.name,
                                icon: l.url || undefined,
                            }))}
                            className="w-full"
                        />
                    </div>

                </div>
                <Input name="accountNumber" label="شماره حساب" value={accountNumber} onChange={e => setAccountNumber(e.target.value)}/>
                <Input name="cardNumber" label="شماره کارت" value={cardNumber} onChange={e => setCardNumber(e.target.value)}/>
                <Input name="shaBaCode" label="شماره شبا" value={shaBaCode} onChange={e => setShaBaCode(e.target.value)}/>
            </div>
        </Modal>
    );
}