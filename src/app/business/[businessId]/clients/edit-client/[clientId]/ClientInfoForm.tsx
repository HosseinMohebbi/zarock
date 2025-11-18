// src/app/.../ClientInfoForm.tsx
'use client';

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import {http} from "@/utils/api/http";
import {type Client} from "@/services/client/client.types";
import {updateClient, deleteClient} from "@/services/client/client.service";
import {MdDelete} from "react-icons/md";
import {toast} from "react-toastify";
import ConfirmModal from "@/app/components/ui/ConfirmModal";

type Props = {
    businessId: string;
    clientId: string;
};

export default function ClientInfoForm({businessId, clientId}: Props) {
    const router = useRouter();

    const [fullName, setFullName] = useState('');
    const [nationalCode, setNationalCode] = useState('');
    const [address, setAddress] = useState('');
    const [invoiceDescription, setInvoiceDescription] = useState('');
    const [isJuridicalPerson, setIsJuridicalPerson] = useState(true);
    const [isOwnerMember, setIsOwnerMember] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false)

    // لود اطلاعات اولیه مشتری
    useEffect(() => {
        async function loadClient() {
            try {
                setLoading(true);
                setError(null);

                const {data} = await http.get<Client>(`/api/client/${businessId}/${clientId}`);

                setFullName(data.fullname);
                setNationalCode(data.nationalCode);
                setAddress(data.address);
                setInvoiceDescription(data.constantDescriptionInvoice);
                setIsJuridicalPerson(data.isJuridicalPerson);
                setIsOwnerMember(data.isOwnerClient);
            } catch (err: any) {
                console.error('Failed to load client:', err);
                setError(err?.message ?? 'خطا در بارگذاری اطلاعات مشتری');
                if (err?.response?.status === 401) {
                    router.push('/login');
                }
            } finally {
                setLoading(false);
            }
        }

        loadClient();
    }, [businessId, clientId, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setSaving(true);

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
            setSaving(false);
        }
    };

    const handleCancel = () => {
        router.push(`/business/${businessId}/clients`);
    };

    function handleDelete() {
        setShowConfirm(true)
    }

    async function confirmDelete() {
        setShowConfirm(false)
        await deleteClient(businessId, clientId)
        router.push(`/business/${businessId}/clients`)
        toast.success("مشتری با موفقیت حذف شد")
    }

    return (
        <div className="w-full max-w-lg !mx-auto !p-6 bg-background text-foreground rounded-lg shadow">
            {/*<h2 className="text-xl font-semibold !mb-4 text-center">*/}
            {/*    ویرایش اطلاعات مشتری*/}
            {/*</h2>*/}
            <div className="relative w-full flex items-start">
                <div onClick={handleDelete} className="absolute right-0 text-danger cursor-pointer">
                    <MdDelete className='w-6 h-6'/>
                </div>
                <h2 className="!mx-auto text-xl font-semibold !mb-4 text-center">ویرایش اطلاعات مشتری</h2>
            </div>

            {loading ? (
                <div className="text-center text-sm text-muted-foreground">
                    در حال بارگذاری اطلاعات مشتری...
                </div>
            ) : (
                <>
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
                        <Input
                            label="نام کامل"
                            name="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />

                        <Input
                            label="کد ملی"
                            name="nationalCode"
                            value={nationalCode}
                            onChange={(e) => setNationalCode(e.target.value)}
                        />

                        <Input
                            label="آدرس"
                            name="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />

                        <Input
                            label="توضیحات فاکتور"
                            name="invoiceDescription"
                            value={invoiceDescription}
                            onChange={(e) => setInvoiceDescription(e.target.value)}
                        />

                        <div className="flex flex-col gap-2">
                            <label className="text-lg font-medium">نوع شخص</label>

                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="clientType"
                                        value="juridical"
                                        checked={isJuridicalPerson === true}
                                        onChange={() => setIsJuridicalPerson(true)}
                                        className="w-4 h-4 accent-primary"
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
                                        className="w-4 h-4 accent-primary"
                                    />
                                    <span>شخص حقیقی</span>
                                </label>
                            </div>

                            <label className="flex items-center gap-2 mt-2">
                                <input
                                    type="checkbox"
                                    checked={isOwnerMember}
                                    onChange={(e) => setIsOwnerMember(e.target.checked)}
                                    className="w-4 h-4 accent-primary"
                                />
                                <span>اعضای کسب و کار</span>
                            </label>
                        </div>

                        <div className="flex justify-end items-center gap-3 !mt-3">
                            <Button
                                type="button"
                                onClick={handleCancel}
                                label="لغو"
                            />
                            <Button
                                type="submit"
                                label={saving ? "در حال ویرایش..." : "ویرایش"}
                                disabled={saving}
                            />
                        </div>
                    </form>
                </>
            )}
            <ConfirmModal
                title="حذف مشتری"
                isOpen={showConfirm}
                message="آیا مطمئن هستید که می‌خواهید این مشتری را حذف کنید؟"
                onConfirm={confirmDelete}
                onCancel={() => setShowConfirm(false)}
            />
        </div>
    );
}
