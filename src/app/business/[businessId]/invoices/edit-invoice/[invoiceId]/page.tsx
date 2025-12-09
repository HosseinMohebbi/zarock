'use client';

import React, {useState, useEffect} from 'react';
import {useParams, useRouter} from 'next/navigation';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';
import Select from '@/app/components/ui/SelectInput';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import {MdAdd, MdDelete, MdMinimize} from "react-icons/md";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import dayjs from "dayjs";
import jalaliday from "jalaliday";

import {getAllClients} from '@/services/client/client.service';
import {Client} from '@/services/client/client.types';
import {getAllInvoice, updateInvoice, updateInvoiceArchive, deleteInvoice} from '@/services/invoice/invoice.service';
import {AddInvoicePayload, GetAllInvoicesResponse} from '@/services/invoice/invoice.types';
import {validate} from '@/services/invoice/invoice.validation';
import {useDispatch, useSelector} from "react-redux";
import {refetchInvoices, selectInvoiceById} from "@/app/store/invoivesSlice";
import {toast} from "react-toastify";


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
    isArchived: boolean;
};

export default function EditInvoiceFormPage() {
    const params = useParams() as { businessId?: string; invoiceId?: string };
    const router = useRouter();
    const businessId = params.businessId ?? '';
    const invoiceId = params.invoiceId ?? '';
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const invoiceFromRedux = useSelector((state: any) =>
        selectInvoiceById(state, invoiceId)
    );

    const [invoice, setInvoice] = useState<GetAllInvoicesResponse | null>(invoiceFromRedux || null);
    const dispatch = useDispatch();

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
        isArchived: false,
    });

    const [clients, setClients] = useState<Client[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [archiveLoading, setArchiveLoading] = useState(false);

    async function handleArchive() {
        if (!businessId || !invoiceId) return;

        setArchiveLoading(true);

        try {
            await updateInvoiceArchive(businessId, invoiceId);
            setShowArchiveModal(false);
            await dispatch(refetchInvoices({businessId})).unwrap();
            router.push(`/business/${businessId}/invoices`);
        } catch (err) {
            console.error(err);
            setMessage("خطا در بایگانی فاکتور");
        } finally {
            setArchiveLoading(false);
        }
    }

    // Fetch clients
    useEffect(() => {
        async function fetchClients() {
            try {
                const clientsData = await getAllClients({page: 1, pageSize: 100}, businessId);
                setClients(clientsData);
            } catch (err) {
                console.error(err);
            }
        }

        fetchClients();
    }, [businessId]);

    // Fetch invoice by finding it in getAllInvoice
    useEffect(() => {
        if (!invoice && businessId) {
            // اگر فاکتور در redux نبود، کل فاکتورها را بگیریم
            getAllInvoice({page: 1, pageSize: 1000}, businessId)
                .then((all) => {
                    const found = all.find(inv => inv.id === invoiceId);
                    setInvoice(found || null);
                })
                .catch(err => console.error(err));
        }
    }, [invoice, businessId, invoiceId]);

    useEffect(() => {
        if (invoice) {
            setForm({
                hint: invoice.hint || '',
                type: invoice.type || 'Invoice',
                fromClient: invoice.fromClient?.id || '',
                toClient: invoice.toClient?.id || '',
                taxPercent: invoice.taxPercent?.toString() || '0',
                discountPercent: invoice.discountPercent?.toString() || '0',
                dateTime: invoice.dateTime || '',
                description: invoice.description || '',
                invoiceItems: invoice.items.map(i => ({
                    fullName: i.fullName,
                    quantity: i.quantity.toString(),
                    quantityMetric: i.quantityMetric,
                    price: i.price.toString(),
                    description: i.description,
                })),
                showItemForm: invoice.items.length > 0,
                isArchived: invoice.isArchived ?? false,
            });
        }
    }, [invoice]);

    async function handleDelete() {
        if (!businessId || !invoiceId) return;
        setDeleteLoading(true);

        try {
            await deleteInvoice(businessId, invoiceId);

            // حذف از Redux پس از حذف واقعی
            await dispatch(refetchInvoices({businessId})).unwrap();

            toast.success("فاکتور با موفقیت حذف شد.");

            router.push(`/business/${businessId}/invoices`);

        } catch (err) {
            console.error(err);
            toast.error("خطا در حذف فاکتور");
        } finally {
            setDeleteLoading(false);
        }
    }

    async function handleSubmit(ev?: React.FormEvent) {
        ev?.preventDefault();
        setMessage(null);
        const v = validate(form)
        if (Object.keys(v).length) {
            setErrors(v)
            return
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

            await dispatch(refetchInvoices({businessId})).unwrap();

            // setMessage('فاکتور با موفقیت ویرایش شد');
            toast.success('فاکتور با موفقیت ویرایش شد.')
            router.push(`/business/${businessId}/invoices`);
        } catch (err: any) {
            console.error(err);
            toast.error('خطا در ویرایش فاکتور!')
            setMessage(err?.message ?? 'خطا در ویرایش فاکتور');
        } finally {
            setLoading(false);
        }
    }

    function toggleItemForm() {
        setForm(f => ({...f, showItemForm: !f.showItemForm}));
    }

    function handleItemChange(index: number, field: string, value: string) {
        setForm(f => {
            const invoiceItems = [...f.invoiceItems];
            invoiceItems[index] = {...invoiceItems[index], [field]: value};
            return {...f, invoiceItems};
        });
    }

    function addNewItem() {
        setForm(f => ({
            ...f,
            invoiceItems: [
                ...f.invoiceItems,
                {fullName: "", quantity: "", quantityMetric: "", price: "", description: ""}
            ],
            showItemForm: true
        }));
    }

    function removeItem(index: number) {
        setForm(f => ({
            ...f,
            invoiceItems: f.invoiceItems.filter((_, i) => i !== index)
        }));
    }

    function handleCancelForm() {
        router.push(`/business/${businessId}/invoices`);
    }


    return (
        <div className="w-full flex justify-center !px-4 !pt-24">
            <div className="w-full max-w-lg mx-auto !p-6 bg-background text-foreground rounded-lg shadow">
                <div className="relative w-full flex items-start">
                    <div onClick={() => setShowDeleteModal(true)}
                         className="absolute right-0 text-danger cursor-pointer">
                        <MdDelete className='w-6 h-6'/>
                    </div>
                    {!form.isArchived ?
                        <h2 className="!mx-auto text-xl font-semibold !mb-4 text-center">ویرایش فاکتور</h2> :
                        <h2 className="!mx-auto !mb-4 text-center !px-3 !py-1 text-xl !rounded-md bg-yellow-100 text-yellow-700">بایگانی
                            شده</h2>}

                    {message && (
                        <div className="!mb-4 text-sm text-center">
                            <span
                                className="inline-block !px-3 !py-1 bg-green-100 text-green-800 rounded">{message}</span>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <Input
                        disabled={form.isArchived}
                        label="توضیح کوتاه"
                        name="hint"
                        value={form.hint}
                        onChange={(e) => setForm(f => ({...f, hint: e.target.value}))}
                    />

                    {/* فروشنده */}
                    <Select
                        disabled={form.isArchived}
                        label="فروشنده"
                        value={form.fromClient}
                        onChange={value => setForm(f => ({...f, fromClient: value}))}
                        options={clients.map(c => ({value: c.id, label: c.fullname}))}
                    />
                    {errors.fromClient && <span className="text-red-500 text-sm">{errors.fromClient}</span>}

                    {/* خریدار */}
                    <Select
                        disabled={form.isArchived}
                        label="خریدار"
                        value={form.toClient}
                        onChange={value => setForm(f => ({...f, toClient: value}))}
                        options={clients.map(c => ({value: c.id, label: c.fullname}))}
                    />
                    {errors.toClient && <span className="text-red-500 text-sm">{errors.toClient}</span>}

                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium">نوع</label>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 text-lg">
                                <input
                                    disabled={form.isArchived}
                                    type="radio"
                                    name="type"
                                    value="PreInvoice"
                                    checked={form.type === 'PreInvoice'}
                                    onChange={() => setForm(f => ({...f, type: 'PreInvoice'}))}
                                    className="accent-primary"
                                />
                                <span>پیش فاکتور</span>
                            </label>
                            <label className="flex items-center gap-2 text-lg">
                                <input
                                    disabled={form.isArchived}
                                    type="radio"
                                    name="type"
                                    value="Invoice"
                                    checked={form.type === 'Invoice'}
                                    onChange={() => setForm(f => ({...f, type: 'Invoice'}))}
                                    className="accent-primary"
                                />
                                <span>فاکتور</span>
                            </label>
                        </div>
                    </div>

                    <Input
                        disabled={form.isArchived}
                        label="مالیات"
                        name="taxPercent"
                        type="number"
                        value={form.taxPercent}
                        onChange={(e) => setForm(f => ({...f, taxPercent: e.target.value}))}
                    />

                    <Input
                        disabled={form.isArchived}
                        label="تخفیف"
                        name="discountPercent"
                        type="number"
                        value={form.discountPercent}
                        onChange={(e) => setForm(f => ({...f, discountPercent: e.target.value}))}
                    />

                    <div className="flex items-center gap-2">
                        <label className="label">تاریخ فاکتور </label>
                        <DatePicker
                            disabled={form.isArchived}
                            calendar={persian}
                            locale={persian_fa}
                            value={form.dateTime ? dayjs(form.dateTime).calendar("jalali").toDate() : new Date()}
                            onChange={(date) =>
                                setForm(f => ({
                                    ...f,
                                    dateTime: date ? dayjs(date).format('YYYY-MM-DDTHH:mm:ss') : ""
                                }))
                            }
                            className="w-full border rounded-md !px-3 !py-2"
                        />
                    </div>

                    <Input
                        disabled={form.isArchived}
                        label="توضیحات"
                        name="description"
                        value={form.description}
                        onChange={(e) => setForm(f => ({...f, description: e.target.value}))}
                    />

                    {form.showItemForm && form.invoiceItems.map((item, idx) => (
                        <div
                            key={idx}
                            className="w-full !p-4 !mt-4 !rounded-lg shadow-md border bg-card  flex flex-col gap-4"
                        >
                            <div className="flex justify-between items-center !mb-2">
                                <h3 className="text-lg font-medium">آیتم {idx + 1}</h3>
                                <button
                                    disabled={form.isArchived}
                                    type="button"
                                    onClick={() => removeItem(idx)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <MdMinimize className="w-6 h-6"/>
                                </button>
                            </div>

                            <Input
                                disabled={form.isArchived}
                                label="کالا یا خدمت"
                                name={`fullName-${idx}`}
                                value={item.fullName}
                                onChange={(e) => handleItemChange(idx, 'fullName', e.target.value)}
                            />

                            <Input
                                disabled={form.isArchived}
                                label="مقدار"
                                name={`quantity-${idx}`}
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                            />
                            {errors[`item_${idx}_quantity`] && (
                                <span className="text-red-500 text-sm">{errors[`item_${idx}_quantity`]}</span>
                            )}

                            <Input
                                disabled={form.isArchived}
                                label="واحد"
                                name={`quantityMetric-${idx}`}
                                value={item.quantityMetric}
                                onChange={(e) => handleItemChange(idx, 'quantityMetric', e.target.value)}
                            />
                            {errors[`item_${idx}_metric`] && (
                                <span className="text-red-500 text-sm">{errors[`item_${idx}_metric`]}</span>
                            )}

                            <Input
                                disabled={form.isArchived}
                                label="قیمت"
                                name={`price-${idx}`}
                                type="number"
                                value={item.price}
                                onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                            />
                            {errors[`item_${idx}_price`] && (
                                <span className="text-red-500 text-sm">{errors[`item_${idx}_price`]}</span>
                            )}

                            <Input
                                disabled={form.isArchived}
                                label="توضیحات آیتم"
                                name={`description-${idx}`}
                                value={item.description}
                                onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                            />
                        </div>
                    ))}

                    {!form.isArchived ? <div className="flex justify-center items-center gap-3 !mt-3">
                            <button
                                disabled={form.isArchived}
                                type="button"
                                className="w-8 h-8 flex justify-center items-center !rounded-full !bg-primary cursor-pointer"
                                onClick={addNewItem}><MdAdd className="w-5 h-5"/>
                            </button>
                        </div>
                        :
                        <Button label="بازگشت" type="button" onClick={handleCancelForm} customStyle="!bg-confirm"/>
                    }

                    {!form.isArchived && (
                        <div className="flex justify-between items-center gap-4 mt-6">
                            <div>
                                <Button
                                    label="بایگانی فاکتور"
                                    onClick={() => setShowArchiveModal(true)}
                                    customStyle="!bg-confirm"
                                />
                            </div>
                            <div className="flex justify-end items-center gap-2">
                                <Button label="لغو" type="button" onClick={handleCancelForm} customStyle="!bg-danger"/>
                                <Button label="ویرایش فاکتور" type="submit" loading={loading}
                                        customStyle="!bg-confirm"/>
                            </div>
                        </div>
                    )}
                </form>
            </div>
            <ConfirmModal
                isOpen={showArchiveModal}
                title="بایگانی فاکتور"
                message="آیا از بایگانی این فاکتور مطمئن هستید؟"
                confirmText="بایگانی"
                cancelText="لغو"
                onCancel={() => setShowArchiveModal(false)}
                onConfirm={handleArchive}
            />
            <ConfirmModal
                isOpen={showDeleteModal}
                title="حذف فاکتور"
                message="آیا از حذف این فاکتور مطمئن هستید؟ این عملیات غیر قابل بازگشت است."
                confirmText="حذف"
                cancelText="لغو"
                dangerColor="hsl(0, 75%, 50%)"
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
}
