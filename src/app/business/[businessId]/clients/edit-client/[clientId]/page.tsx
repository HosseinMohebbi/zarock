'use client';
import {useEffect, useState, useRef} from "react";
import {useParams, useRouter} from 'next/navigation';
import {cn} from "@/utils/cn";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import Modal from "@/app/components/ui/Modal";
import Card from "@/app/components/ui/Card";
import {
    BankLogo,
    Client,
    getBankLogos,
    createBankAccount,
    updateClient,
    updateBankAccount,
    getBankAccounts
} from "@/services/client";
import {http} from "@/utils/api/http";
import {MdAdd} from "react-icons/md";
import {toast} from "react-toastify";


interface BankAccountResponse {
    id: string;
    bankName?: string;
    accountNumber?: string;
    cardNumber?: string;
    shaBaCode?: string;
}

export default function EditClient() {
    const [fullName, setFullName] = useState('');
    const [nationalCode, setNationalCode] = useState('');
    const [address, setAddress] = useState('');
    const [invoiceDescription, setInvoiceDescription] = useState('');
    const [isJuridicalPerson, setIsJuridicalPerson] = useState(true);
    const [isOwnerMember, setIsOwnerMember] = useState(false);

    const [logos, setLogos] = useState<BankLogo[]>([]);
    const [selectedBank, setSelectedBank] = useState<BankLogo | null>(null);
    const [dropdownRef, setDropdownRef] = useState<HTMLDivElement | null>(null);

    const [bankAccounts, setBankAccounts] = useState<BankAccountResponse[]>([]);
    const [accountsLoading, setAccountsLoading] = useState(true);
    const [accountsError, setAccountsError] = useState<string | null>(null);

    const [editingAccount, setEditingAccount] = useState<BankAccountResponse | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const params = useParams() as { businessId?: string; clientId?: string };
    const businessId = params.businessId ?? '';
    const clientId = params.clientId ?? '';
    const router = useRouter();

    // load client + logos + bank accounts
    useEffect(() => {
        async function loadClient() {
            if (!businessId || !clientId) {
                setError('شناسه کسب‌وکار یا مشتری نامعتبر است');
                setAccountsError('شناسه کسب‌وکار یا مشتری نامعتبر است');
                setAccountsLoading(false);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setAccountsLoading(true);

                const {data} = await http.get<Client>(`/api/client/${businessId}/${clientId}`);
                const logos = await getBankLogos();
                setLogos(logos);

                // load bank accounts
                try {
                    const accounts = await getBankAccounts(businessId, clientId);
                    setBankAccounts(accounts ?? []);
                    setAccountsError(null);

                    if (accounts && accounts.length > 0 && logos.length > 0) {
                        const firstBankName = accounts[0].bankName?.toLowerCase() ?? '';
                        const matched = logos.find(l => l.name?.toLowerCase() === firstBankName);
                        if (matched) setSelectedBank(matched);
                    }
                } catch (accErr: any) {
                    console.error('Failed to load bank accounts:', accErr);
                    setBankAccounts([]);
                    setAccountsError(accErr?.message ?? 'خطا در دریافت حساب‌های بانکی');
                }

                setFullName(data.fullname);
                setNationalCode(data.nationalCode);
                setAddress(data.address);
                setInvoiceDescription(data.constantDescriptionInvoice);
                setIsJuridicalPerson(data.isJuridicalPerson);
                setIsOwnerMember(data.isOwnerClient);
                setError(null);
            } catch (err: any) {
                console.error('Failed to load client:', err);
                setError(err?.message ?? 'خطا در بارگذاری اطلاعات مشتری');
                if (err?.response?.status === 401) {
                    router.push('/login');
                }
            } finally {
                setLoading(false);
                setAccountsLoading(false);
            }
        }

        loadClient();
    }, [businessId, clientId, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            await updateClient(businessId, clientId, {
                fullName,
                nationalCode,
                address,
                constantDescriptionInvoice: invoiceDescription,
                isJuridicalPerson,
                isOwnerMember,
                tags: [],
            });
            setSuccess("اطلاعات مشتری با موفقیت به‌روزرسانی شد");
            router.push(`/business/${businessId}/clients`);
        } catch (err: any) {
            console.error("Failed to update client:", err);
            setError(err?.message ?? "خطا در به‌روزرسانی اطلاعات مشتری");
        } finally {
            setLoading(false);
        }
    };

    async function loadBankAccounts() {
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
    }

    function handleEditAccount(account: BankAccountResponse) {
        setEditingAccount(account);
        setModalOpen(true);
    }

    async function handleModalSubmit(data: {
        selectedBank: BankLogo;
        accountNumber: string;
        cardNumber: string;
        shaBaCode: string
    }) {
        if (!data.selectedBank) return;

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (editingAccount) {
                await updateBankAccount(businessId, editingAccount.id, {
                    bankName: data.selectedBank.name,
                    accountNumber: data.accountNumber,
                    cardNumber: data.cardNumber,
                    shaBaCode: data.shaBaCode,
                });
                // setSuccess("حساب بانکی با موفقیت ویرایش شد");
                toast.success("حساب بانکی با موفقیت ویرایش شد");
            } else {
                await createBankAccount(businessId, clientId, {
                    bankName: data.selectedBank.name,
                    accountNumber: data.accountNumber,
                    cardNumber: data.cardNumber,
                    shaBaCode: data.shaBaCode,
                });
                setSuccess("حساب بانکی با موفقیت اضافه شد");
            }
            await loadBankAccounts();
        } catch (err: any) {
            console.error(err);
            setError(err?.message ?? "خطا در عملیات حساب بانکی");
        } finally {
            setLoading(false);
            setModalOpen(false);
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center h-screen">در حال بارگذاری...</div>;
    }

    return (
        <div className="w-full h-full  py-6 px-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-medium">ویرایش اطلاعات مشتری</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="w-full flex flex-col items-center justify-between gap-4">
                    <div className="w-full flex flex-col items-center justify-between gap-4">
                        <Input label="نام کامل" name="fullName" value={fullName} containerClass="w-[80%]"
                               onChange={(e) => setFullName(e.target.value)}/>
                        <Input label="کد ملی" name="nationalCode" value={nationalCode} containerClass="w-[80%]"
                               onChange={(e) => setNationalCode(e.target.value)}/>
                        <Input label="آدرس" name="address" value={address} containerClass="w-[80%]"
                               onChange={(e) => setAddress(e.target.value)}/>
                        <Input label="توضیحات فاکتور" name="invoiceDescription" value={invoiceDescription}
                               containerClass="w-[80%]" onChange={(e) => setInvoiceDescription(e.target.value)}/>
                    </div>
                    <div className="w-[80%] flex flex-col justify-center items-start gap-6">
                        <div className="flex justify-center items-center gap-6">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="clientType"
                                    value="juridical"
                                    checked={isJuridicalPerson === true}
                                    onChange={() => setIsJuridicalPerson(true)}
                                    className="w-4 h-4"
                                />
                                <span>شخص حقوقی</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="clientType"
                                    value="real"
                                    checked={isJuridicalPerson === false}
                                    onChange={() => setIsJuridicalPerson(false)}
                                    className="w-4 h-4"
                                />
                                <span>شخص حقیقی</span>
                            </label>
                        </div>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={isOwnerMember}
                                   onChange={(e) => setIsOwnerMember(e.target.checked)} className="w-4 h-4"/>
                            <span>اعضای کسب و کار</span>
                        </label>
                    </div>
                </div>
                <div className="flex gap-4 mt-6">
                    <Button type="submit" label="ویرایش" disabled={loading}
                            customStyle="bg-green-600 hover:bg-green-700"/>
                    <Button type="button" onClick={() => router.push(`/${businessId}/clients`)}
                            customStyle="bg-gray-500 hover:bg-gray-600">
                        انصراف
                    </Button>
                </div>

                {error && <div className="text-red-600 mt-4">{error}</div>}
                {/*{success && <div className="text-green-600 mt-4">{success}</div>}*/}
            </form>

            <h3 className="text-md font-medium mt-8 mb-3">حساب‌های بانکی</h3>
            {accountsLoading ? (
                <div>در حال بارگذاری حساب‌ها...</div>
            ) : accountsError ? (
                <div className="text-red-600">{accountsError}</div>
            ) : bankAccounts.length === 0 ? (
                <div className="text-sm text-zinc-500">حساب بانکی ثبت نشده است.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {bankAccounts.map((acc) => {
                        const logo = logos.find(l => l.name?.toLowerCase() === acc.bankName?.toLowerCase());
                        return (
                            <Card
                                key={acc.id}
                                title={acc.bankName}
                                icon={logo?.url ? <img src={logo.url} alt={logo.name}
                                                       className="w-8 h-8 object-contain rounded-sm"/> : <div
                                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-sm text-xs">{acc.bankName?.slice(0, 2)}</div>}
                            >
                                <div className="text-sm text-gray-700 leading-6">
                                    <div>شماره حساب: <span className="font-medium">{acc.accountNumber}</span></div>
                                    <div>شماره کارت: <span className="font-medium">{acc.cardNumber}</span></div>
                                    <div>شماره شبا: <span className="font-medium">{acc.shaBaCode}</span></div>
                                </div>
                                <div className="flex justify-end mt-3">
                                    <button onClick={() => handleEditAccount(acc)}
                                            className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700">
                                        ویرایش
                                    </button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            <div className="mt-6">
                <Button label="افزودن حساب بانکی" type="button" onClick={handleAddNewAccount}
                        customStyle="bg-green-600 hover:bg-green-700">
                    <MdAdd className="inline mr-1"/> افزودن حساب بانکی
                </Button>
            </div>

            {/* ---------------- مدال حساب بانکی ---------------- */}
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

// ---------------- مدال حساب بانکی ----------------
interface BankAccountModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { selectedBank: BankLogo; accountNumber: string; cardNumber: string; shaBaCode: string }) => void;
    editingAccount: BankAccountResponse | null;
    logos: BankLogo[];
}

function BankAccountModal({open, onClose, onSubmit, editingAccount, logos}: BankAccountModalProps) {
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
        <Modal open={open} onClose={onClose} onSubmit={handleSubmit}
               modalTitle={editingAccount ? "ویرایش حساب" : "افزودن حساب"}>
            <div className="space-y-3 mt-4">
                <div>
                    <label className="block text-sm font-medium mb-2">بانک</label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-full px-3 py-2 border rounded-md flex justify-between items-center"
                        >
                            {selectedBank?.name || "انتخاب بانک"}
                            <span className={`${dropdownOpen ? "rotate-180" : ""} transition-transform`}>▼</span>
                        </button>

                        {dropdownOpen && (
                            <ul className="absolute bg-white border mt-1 w-full z-10 max-h-48 overflow-auto text-right">
                                {logos.map(l => (
                                    <li key={l.name}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedBank(l);
                                                setDropdownOpen(false);
                                            }}
                                            className="w-full flex items-center gap-2 justify-start !px-3 !py-1 hover:bg-gray-100 d"

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
