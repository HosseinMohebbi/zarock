'use client';
import {useEffect, useState} from 'react';
import Modal from "@/app/components/ui/Modal";
import Input from "@/app/components/ui/Input";
import {BankAccountResponse, BankLogo} from "@/services/client";
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
        <Modal open={open} confirmButtonTitle='ویرایش' onClose={onClose} onSubmit={handleSubmit}
               modalTitle={editingAccount ? "ویرایش حساب" : "افزودن حساب"}>
            <div className="space-y-3 !mt-4">
                <div>
                    <label className="block text-sm font-medium !mb-2">بانک</label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-full !px-3 !py-2 border !rounded-md flex justify-between items-center"
                        >
                            {selectedBank?.name || "انتخاب بانک"}
                            <span className={`${dropdownOpen ? "rotate-180" : ""} transition-transform`}>▼</span>
                        </button>

                        {dropdownOpen && (
                            <ul className="absolute bg-card border !mt-1 w-full z-10 max-h-48 overflow-auto text-right">
                                {logos.map(l => (
                                    <li key={l.name}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedBank(l);
                                                setDropdownOpen(false);
                                            }}
                                            className="w-full flex items-center gap-2 justify-start !px-3 !py-1 hover:bg-gray-100"

                                        >
                                            {l.url && (
                                                <img
                                                    src={l.url}
                                                    alt={l.name}
                                                    className="w-6 h-6 object-contain rounded-sm"
                                                />
                                            )}
                                            <span>{l.name}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                </div>
                <Input label="شماره حساب" value={accountNumber} onChange={e => setAccountNumber(e.target.value)}/>
                <Input label="شماره کارت" value={cardNumber} onChange={e => setCardNumber(e.target.value)}/>
                <Input label="شماره شبا" value={shaBaCode} onChange={e => setShaBaCode(e.target.value)}/>
            </div>
        </Modal>
    );
}