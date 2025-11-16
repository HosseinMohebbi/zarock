'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';
import Select from '@/app/components/ui/SelectInput';
import { MdAdd, MdMinimize } from "react-icons/md";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import dayjs from "dayjs";
import jalaliday from "jalaliday";

import { getAllClients } from '@/services/client/client.service';
import { Client } from '@/services/client/client.types';
import { getAllInvoice, updateInvoice } from '@/services/invoice/invoice.service';
import { AddInvoicePayload } from '@/services/invoice/invoice.types';

dayjs.extend(jalaliday);

type FormState = {
    hint: string;
    type: 'Invoice' | 'PreInvoice';
    fromClient: string;
    toClient: string;
    taxPercent: string;
    discountPercent: string;
    dateTime: string;
    description: string;
    invoiceItems: Array<{
        fullName: string;
        quantity: string;
        quantityMetric: string;
        price: string;
        description: string;
    }>;
    showItemForm: boolean;
};

export default function EditInvoiceFormPage() {
    const params = useParams() as { businessId?: string; invoiceId?: string };
    const router = useRouter();
    const businessId = params.businessId ?? '';
    const invoiceId = params.invoiceId ?? '';

    const [form, setForm] = useState<FormState>({
        hint: '',
        type: 'Invoice',
        fromClient: '',
        toClient: '',
        taxPercent: '',
        discountPercent: '',
        dateTime: '',
        description: '',
        invoiceItems: [],
        showItemForm: false,
    });

    const [clients, setClients] = useState<Client[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // Fetch clients
    useEffect(() => {
        async function fetchClients() {
            try {
                const clientsData = await getAllClients({ page: 1, pageSize: 100 }, businessId);
                setClients(clientsData);
            } catch (err) {
                console.error(err);
            }
        }
        fetchClients();
    }, [businessId]);

    // Fetch invoice by finding it in getAllInvoice
    useEffect(() => {
        async function fetchInvoice() {
            if (!businessId || !invoiceId) return;

            try {
                const invoices = await getAllInvoice({ page: 1, pageSize: 1000 }, businessId);
                const invoice = invoices.find(inv => inv.id === invoiceId);

                if (!invoice) {
                    setMessage('فاکتور پیدا نشد');
                    return;
                }

                setForm({
                    hint: invoice.hint || '',
                    type: invoice.type || 'Invoice',
                    fromClient: invoice.fromClient.id,
                    toClient: invoice.toClient.id,
                    taxPercent: invoice.taxPercent.toString(),
                    discountPercent: invoice.discountPercent.toString(),
                    dateTime: invoice.dateTime,
                    description: invoice.description || '',
                    invoiceItems: invoice.items.map(i => ({
                        fullName: i.fullName,
                        quantity: i.quantity.toString(),
                        quantityMetric: i.quantityMetric,
                        price: i.price.toString(),
                        description: i.description,
                    })),
                    showItemForm: invoice.items.length > 0,
                });
            } catch (err) {
                console.error(err);
                setMessage('خطا در دریافت اطلاعات فاکتور');
            }
        }
        fetchInvoice();
    }, [businessId, invoiceId]);

    function validate() {
        const e: Record<string, string> = {};
        if (!form.fromClient) e.fromClient = 'فروشنده را انتخاب کنید';
        if (!form.toClient) e.toClient = 'خریدار را انتخاب کنید';
        return e;
    }

    async function handleSubmit(ev?: React.FormEvent) {
        ev?.preventDefault();
        setMessage(null);
        const v = validate();
        if (Object.keys(v).length) {
            setErrors(v);
            return;
        }

        if (!businessId || !invoiceId) {
            setMessage('شناسه کسب‌وکار یا فاکتور پیدا نشد');
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const payload: AddInvoicePayload = {
                hint: form.hint,
                type: form.type,
                fromClient: form.fromClient,
                toClient: form.toClient,
                taxPercent: Number(form.taxPercent),
                discountPercent: Number(form.discountPercent),
                dateTime: form.dateTime,
                description: form.description,
                invoiceItems: form.invoiceItems,
            };

            await updateInvoice(businessId, invoiceId, payload);

            setMessage('فاکتور با موفقیت ویرایش شد');
            router.push(`/business/${businessId}/invoices`);
        } catch (err: any) {
            console.error(err);
            setMessage(err?.message ?? 'خطا در ویرایش فاکتور');
        } finally {
            setLoading(false);
        }
    }

    function toggleItemForm() {
        setForm(f => ({ ...f, showItemForm: !f.showItemForm }));
    }

    function handleItemChange(index: number, field: string, value: string) {
        setForm(f => {
            const invoiceItems = [...f.invoiceItems];
            invoiceItems[index] = { ...invoiceItems[index], [field]: value };
            return { ...f, invoiceItems };
        });
    }

    return (
        <div className="w-full flex justify-center !px-4">
            <div className="w-full max-w-lg mx-auto !p-6 bg-background text-foreground rounded-lg shadow">
                <h2 className="text-xl font-semibold !mb-4 text-center">ویرایش فاکتور</h2>

                {message && (
                    <div className="!mb-4 text-sm text-center">
                        <span className="inline-block !px-3 !py-1 bg-green-100 text-green-800 rounded">{message}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <Input
                        label="توضیح کوتاه"
                        name="hint"
                        value={form.hint}
                        onChange={(e) => setForm(f => ({ ...f, hint: e.target.value }))}
                    />

                    {/* فروشنده */}
                    <Select
                        label="فروشنده"
                        value={form.fromClient}
                        onChange={value => setForm(f => ({ ...f, fromClient: value }))}
                        options={clients.map(c => ({ value: c.id, label: c.fullname }))}
                    />
                    {errors.fromClient && <span className="text-red-500 text-sm">{errors.fromClient}</span>}

                    {/* خریدار */}
                    <Select
                        label="خریدار"
                        value={form.toClient}
                        onChange={value => setForm(f => ({ ...f, toClient: value }))}
                        options={clients.map(c => ({ value: c.id, label: c.fullname }))}
                    />
                    {errors.toClient && <span className="text-red-500 text-sm">{errors.toClient}</span>}

                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium">نوع</label>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 text-lg">
                                <input
                                    type="radio"
                                    name="type"
                                    value="PreInvoice"
                                    checked={form.type === 'PreInvoice'}
                                    onChange={() => setForm(f => ({ ...f, type: 'PreInvoice' }))}
                                    className="accent-primary"
                                />
                                <span>پیش فاکتور</span>
                            </label>
                            <label className="flex items-center gap-2 text-lg">
                                <input
                                    type="radio"
                                    name="type"
                                    value="Invoice"
                                    checked={form.type === 'Invoice'}
                                    onChange={() => setForm(f => ({ ...f, type: 'Invoice' }))}
                                    className="accent-primary"
                                />
                                <span>فاکتور</span>
                            </label>
                        </div>
                    </div>

                    <Input
                        label="مالیات"
                        name="taxPercent"
                        type="number"
                        value={form.taxPercent}
                        onChange={(e) => setForm(f => ({ ...f, taxPercent: e.target.value }))}
                    />

                    <Input
                        label="تخفیف"
                        name="discountPercent"
                        type="number"
                        value={form.discountPercent}
                        onChange={(e) => setForm(f => ({ ...f, discountPercent: e.target.value }))}
                    />

                    <div className="flex items-center gap-2">
                        <label className="label">تاریخ فاکتور </label>
                        <DatePicker
                            calendar={persian}
                            locale={persian_fa}
                            value={form.dateTime ? dayjs(form.dateTime).calendar("jalali").toDate() : dayjs().calendar("jalali").toDate()}
                            onChange={(date) => setForm(f => ({ ...f, dateTime: date ? dayjs(date).toISOString() : "" }))}
                            className="w-full border rounded-md !px-3 !py-2"
                        />
                    </div>

                    <Input
                        label="توضیحات"
                        name="description"
                        value={form.description}
                        onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                    />

                    <div className="flex justify-center items-center gap-3 !mt-3">
                        <button
                            type="button"
                            className="w-8 h-8 flex justify-center items-center !rounded-full !bg-green-400 cursor-pointer"
                            onClick={toggleItemForm}><MdAdd className="w-5 h-5" />
                        </button>
                    </div>

                    {form.showItemForm && (
                        <div className="!p-4 !mt-4 !rounded-lg shadow-md">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium mb-3">افزودن آیتم</h3>
                                <button type="button" onClick={toggleItemForm}><MdMinimize className="w-5 h-5" /></button>
                            </div>
                            {form.invoiceItems.map((item, idx) => (
                                <div key={idx} className="flex flex-col gap-2 mb-3">
                                    <Input
                                        label="کالا یا خدمت"
                                        value={item.fullName}
                                        onChange={(e) => handleItemChange(idx, 'fullName', e.target.value)}
                                    />
                                    <Input
                                        label="مقدار"
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                                    />
                                    <Input
                                        label="واحد"
                                        value={item.quantityMetric}
                                        onChange={(e) => handleItemChange(idx, 'quantityMetric', e.target.value)}
                                    />
                                    <Input
                                        label="قیمت"
                                        type="number"
                                        value={item.price}
                                        onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                                    />
                                    <Input
                                        label="توضیحات آیتم"
                                        value={item.description}
                                        onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-center mt-6">
                        <Button label="ویرایش فاکتور" type="submit" loading={loading} />
                    </div>
                </form>
            </div>
        </div>
    );
}
