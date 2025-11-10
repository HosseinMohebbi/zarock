'use client';
import {useState} from "react";
import { useParams, useRouter } from 'next/navigation';
import {cn} from "@/utils/cn";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import Card from "@/app/components/ui/Card";
import ThemeToggle from "@/app/components/theme/ThemeToggle";
import {createClient} from "@/services/client";

export default function Client() {
    const [fullName, setFullName] = useState('');
    const [nationalCode, setNationalCode] = useState('');
    const [address, setAddress] = useState('');
    const [invoiceDescription, setInvoiceDescription] = useState('');
    const [isJuridicalPerson, setIsJuridicalPerson] = useState(false);
    const [isOwnerMember, setIsOwnerMember] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const params = useParams() as { businessId?: string };
    const businessId = params.businessId ?? '';
    const router = useRouter();
    console.log('bid', businessId)


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const addTag = () => {
        const t = tagInput.trim();
        if (!t) return;
        if (tags.includes(t)) {
            setTagInput('');
            return;
        }
        setTags(prev => [...prev, t]);
        setTagInput('');
    };

    const removeTag = (t: string) => {
        setTags(prev => prev.filter(x => x !== t));
    };

    const validate = (): string | null => {
        if (!fullName.trim()) return 'نام کامل لازم است.';
        if (!nationalCode.trim()) return 'کد ملی لازم است.';
        return null;
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setError(null);
        setSuccess(null);

        const v = validate();
        if (v) {
            setError(v);
            return;
        }

        const payload = {
            fullName: fullName.trim(),
            nationalCode: nationalCode.trim(),
            constantDescriptionInvoice: invoiceDescription.trim(),
            isJuridicalPerson,
            isOwnerMember,
            address: address.trim(),
            tags
        };

        setLoading(true);
        try {
            await createClient(businessId, payload);
            // بعد از موفقیت می‌تونید ریدایرکت کنید
            router.push(`/clients/${businessId}`);
        } catch (err: any) {
            setError(err?.message ?? 'خطای سرور');
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="w-full h-full py-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-medium">شخص جدید</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="نام کامل"
                    name="fullName"
                    value={fullName}
                    containerClass={cn('w-full')}
                    onChange={(e) => setFullName(e.target.value)}
                />

                <Input
                    label="کد ملی"
                    name="natioalCode"
                    value={nationalCode}
                    containerClass={cn('w-full')}
                    onChange={(e) => setNationalCode(e.target.value)}
                />
                <Input
                    label="آدرس"
                    name="address"
                    value={address}
                    containerClass={cn('w-full')}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <Input
                    label="توضیحات فاکتور"
                    name="invoiceDescription"
                    value={invoiceDescription}
                    containerClass={cn('w-full')}
                    onChange={(e) => setInvoiceDescription(e.target.value)}
                />


                <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={isJuridicalPerson}
                            onChange={(e) => setIsJuridicalPerson(e.target.checked)}
                            className="w-4 h-4"
                        />
                        <span>شخص حقوقی؟</span>
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={isOwnerMember}
                            onChange={(e) => setIsOwnerMember(e.target.checked)}
                            className="w-4 h-4"
                        />
                        <span>عضو مالک هست؟</span>
                    </label>
                </div>
                <button type="submit">افزودن</button>

                {/* بقیه فیلدها را مشابه قبلی اضافه کنید */}
                {/*<div className="flex gap-2">*/}
                {/*    <Button type="submit" disabled={loading} customStyle="w-[300px] h-[200px] bg-red-400">*/}
                {/*        افزودن*/}
                {/*    </Button>*/}
                {/*</div>*/}

                {error && <div className="text-red-600 mt-2">{error}</div>}
                {success && <div className="text-green-600 mt-2">{success}</div>}
            </form>
        </div>
    );
}
