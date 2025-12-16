'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import {validateClient, FieldErrors} from '@/services/client/client.validation'

import { useDispatch, useSelector } from "react-redux";
import {
    fetchClientById,
    updateClientThunk,
    deleteClientThunk,
    selectClientById
} from "@/app/store/clientsSlice";

type Props = {
    businessId: string;
    clientId: string;
};

export default function ClientInfoForm({ businessId, clientId }: Props) {
    const router = useRouter();
    const dispatch = useDispatch<any>();

    const client = useSelector((state: any) => selectClientById(state, clientId));

    // -----------------------------
    // Local form state
    // -----------------------------
    const [fullName, setFullName] = useState('');
    const [nationalCode, setNationalCode] = useState('');
    const [address, setAddress] = useState('');
    const [invoiceDesc, setInvoiceDesc] = useState('');
    const [isJuridicalPerson, setIsJuridicalPerson] = useState(true);
    const [isOwnerClient, setIsOwnerClient] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [success, setSuccess] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    // -----------------------------
    // Load client data from Redux
    // -----------------------------
    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                await dispatch(fetchClientById({ businessId, clientId })).unwrap();
            } catch (err: any) {
                setError(err?.message ?? "خطا در بارگذاری اطلاعات مشتری");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [businessId, clientId, dispatch]);

    // -----------------------------
    // Sync client → local state
    // -----------------------------
    useEffect(() => {
        if (!client) return;

        setFullName(client.fullname);
        setNationalCode(client.nationalCode);
        setAddress(client.address);
        setInvoiceDesc(client.constantDescriptionInvoice);
        setIsJuridicalPerson(client.isJuridicalPerson);
        setIsOwnerClient(client.isOwnerClient);
    }, [client]);

    // -----------------------------
    // Submit handler
    // -----------------------------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        const fieldErrs: FieldErrors = validateClient({
            fullName,
            nationalCode,
            address
        });
        setFieldErrors(fieldErrs);

        // اگر خطای فیلد داریم، جلوتر نریم
        if (Object.keys(fieldErrs).length > 0) {
            return;
        }

        try {
            await dispatch(updateClientThunk({
                businessId,
                clientId,
                payload: {
                    fullname: fullName,
                    nationalCode,
                    address,
                    constantDescriptionInvoice: invoiceDesc,
                    isJuridicalPerson,
                    isOwnerClient,
                }
            })).unwrap();

            // setSuccess("اطلاعات شخص با موفقیت به‌روزرسانی شد");
            toast.success('اطلاعات شخص با موفقیت ویرایش شد.')
            router.push(`/business/${businessId}/clients`);
        } catch (err: any) {
            toast.error('خطا در ویرایش اطلاعات شخص!')
            setError(err?.message ?? "خطا در به‌روزرسانی اطلاعات مشتری");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        router.push(`/business/${businessId}/clients`);
    };

    // -----------------------------
    // Delete client
    // -----------------------------
    const handleDelete = () => setShowConfirm(true);

    const confirmDelete = async () => {
        setShowConfirm(false);
        try {
            await dispatch(deleteClientThunk({ businessId, clientId })).unwrap();
            toast.success("مشتری با موفقیت حذف شد");
            router.push(`/business/${businessId}/clients`);
        } catch (err: any) {
            toast.error(err?.message ?? "خطا در حذف مشتری");
        }
    };

    if (loading) {
        return (
            <div className="text-center text-sm text-muted-foreground">
                در حال بارگذاری اطلاعات مشتری...
            </div>
        );
    }

    // -----------------------------
    // UI Rendering
    // -----------------------------
    return (
        <div className="w-full max-w-lg !mx-auto !p-6 bg-background text-foreground rounded-lg shadow">
            <div className="relative w-full flex items-start">
                <div onClick={handleDelete} className="absolute right-0 text-danger cursor-pointer">
                    <MdDelete className='w-6 h-6' />
                </div>
                <h2 className="!mx-auto text-xl font-semibold !mb-4 text-center">
                    ویرایش اطلاعات مشتری
                </h2>
            </div>

            {success && (
                <div className="!mb-4 text-sm text-center">
                    <span className="inline-block !px-3 !py-1 bg-green-100 text-green-800 rounded">
                        {success}
                    </span>
                </div>
            )}

            {error && (
                <div className="!mb-4 text-sm text-center">
                    <span className="inline-block !px-3 !py-1 bg-red-100 text-red-800 rounded">
                        {error}
                    </span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <Input name="fullName" label="نام کامل" value={fullName} onChange={e => setFullName(e.target.value)} error={fieldErrors.fullName}/>
                <Input name="nationalCode" label="کد ملی" value={nationalCode} onChange={e => setNationalCode(e.target.value)} error={fieldErrors.nationalCode}/>
                <Input name="address" label="آدرس" value={address} onChange={e => setAddress(e.target.value)} error={fieldErrors.address}/>
                <Input name="description" label="توضیحات فاکتور" value={invoiceDesc} onChange={e => setInvoiceDesc(e.target.value)} />

                <div className="flex flex-col gap-2">
                    <label className="text-lg font-medium">نوع شخص</label>
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="clientType"
                                checked={isJuridicalPerson}
                                onChange={() => setIsJuridicalPerson(true)}
                                className="w-4 h-4 accent-primary"
                            />
                            <span>شخص حقوقی</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="clientType"
                                checked={!isJuridicalPerson}
                                onChange={() => setIsJuridicalPerson(false)}
                                className="w-4 h-4 accent-primary"
                            />
                            <span>شخص حقیقی</span>
                        </label>
                    </div>

                    <label className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            checked={isOwnerClient}
                            onChange={(e) => setIsOwnerClient(e.target.checked)}
                            className="w-4 h-4 accent-primary"
                        />
                        <span>اعضای کسب و کار</span>
                    </label>
                </div>

                <div className="flex justify-end items-center gap-3 !mt-3">
                    <Button type="button" onClick={handleCancel} label="لغو" customStyle="!bg-danger"/>
                    <Button type="submit" label="ذخیره" customStyle="!bg-confirm"/>
                </div>
            </form>

            <ConfirmModal
                title="حذف مشتری"
                isOpen={showConfirm}
                message="آیا از حذف این شخص مطمئن هستید؟ این عملیات غیر قابل بازگشت است."
                onConfirm={confirmDelete}
                onCancel={() => setShowConfirm(false)}
            />
        </div>
    );
}

