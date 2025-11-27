'use client';

import React, {useState, useEffect} from 'react';
import {useParams, useRouter} from 'next/navigation';
import Input from '@/app/components/ui/Input';
import {createInvoice} from '@/services/invoice/invoice.service';
import Button from '@/app/components/ui/Button';
import Select, {SelectOption} from '@/app/components/ui/SelectInput';
import {MdAdd, MdMinimize} from "react-icons/md";
import {getAllClients} from '@/services/client/client.service';
import {Client} from '@/services/client/client.types';
import {validate} from '@/services/invoice/invoice.validation';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import DatePicker from "react-multi-date-picker";
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
        description: string
    }>;
    showItemForm: boolean;
};

export default function AddInvoiceFormPage() {
    const params = useParams() as { businessId?: string };
    const router = useRouter();
    const businessId = params?.businessId ?? '';

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
                const clientsData = await getAllClients({page: 1, pageSize: 100}, businessId);
                setClients(clientsData);
            } catch (error) {
                console.error(error);
            }
        }

        fetchClients();
    }, [businessId]);

    // Handle Submit
    async function handleSubmit(ev?: React.FormEvent) {
        ev?.preventDefault();
        setMessage(null);
        console.log("Form Submitted!", form);
        const v = validate(form)
        if (Object.keys(v).length) {
            setErrors(v)
            return
        }
        
        if (!businessId) {
            setMessage('شناسه کسب‌وکار پیدا نشد');
            return;
        }

        setLoading(true);
        setErrors({});
        try {
            const payload = {
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

            console.log("Payload to send:", payload);

            await createInvoice(businessId, payload);

            console.log("Payload to send:", payload);

            // setMessage('فاکتور با موفقیت ایجاد شد');
            toast.success('فاکتور با موفقیت اضافه شد')
            setForm({
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
            router.push(`/business/${businessId}/invoices`);
        } catch (err: any) {
            console.error(err);
            setMessage(err?.message ?? 'خطا در ایجاد فاکتور');
            toast.error('خطا در افزودن فاکتور!')
        } finally {
            setLoading(false);
        }
    }

    // Toggle Item Form
    function toggleItemForm() {
        setForm((f) => ({...f, showItemForm: !f.showItemForm}));
    }

    // Handle Item Change
    function handleItemChange(index: number, field: string, value: string) {
        setForm((f) => {
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
                {
                    fullName: "",
                    quantity: "",
                    quantityMetric: "",
                    price: "",
                    description: ""
                }
            ]
        }));
    }

    const handleDateChange = (date: Date) => {
        const formattedDate = date ? dayjs(date).calendar('jalali').toISOString() : '';
        setForm((f) => ({
            ...f,
            date: formattedDate, // ذخیره تاریخ به فرمت شمسی
        }));
    };

    return (
        <div className="w-full flex justify-center !px-4">
            <div className="w-full max-w-lg mx-auto !p-6 bg-background text-foreground rounded-lg shadow">
                <h2 className="text-xl font-semibold !mb-4 text-center">ایجاد فاکتور جدید</h2>

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
                        onChange={(e) => setForm((f) => ({...f, hint: e.target.value}))}
                    />
                    {/* فروشنده */}
                    <Select
                        label="فروشنده"
                        value={form.fromClient}
                        onChange={(value) => setForm((f) => ({...f, fromClient: value}))}
                        options={clients.map((client) => ({
                            value: client.id,
                            label: client.fullname,
                        }))}
                    />
                    {errors.fromClient && <span className="text-red-500 text-sm">{errors.fromClient}</span>}

                    {/* خریدار */}
                    <Select
                        label="خریدار"
                        value={form.toClient}
                        onChange={(value) => setForm((f) => ({...f, toClient: value}))}
                        options={clients.map((client) => ({
                            value: client.id,
                            label: client.fullname,
                        }))}
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
                                    onChange={() => setForm(f => ({...f, type: 'PreInvoice'}))}
                                    className="accent-primary"
                                />
                                <span>پیش فاکتور</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input
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

                    {/* مالیات */}
                    <Input
                        label="مالیات"
                        name="taxPercent"
                        type="number"
                        value={form.taxPercent}
                        onChange={(e) => setForm((f) => ({...f, taxPercent: e.target.value}))}
                    />

                    {/* تخفیف */}
                    <Input
                        label="تخفیف"
                        name="discountPercent"
                        type="number"
                        value={form.discountPercent}
                        onChange={(e) => setForm((f) => ({...f, discountPercent: e.target.value}))}
                    />

                    {/* تاریخ */}
                    <div className="flex items-center gap-2">
                        <label className="label">تاریخ فاکتور </label>
                        <DatePicker
                            calendar={persian}
                            locale={persian_fa}
                            value={
                                form.dateTime
                                    ? dayjs(form.dateTime).toDate()
                                    : new Date()
                            }
                            onChange={(date) =>
                                setForm((f) => ({
                                    ...f,
                                    dateTime: date ? date.toDate().toISOString() : ""
                                }))
                            }
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>
                    {/* توضیحات */}
                    <Input
                        label="توضیحات"
                        name="description"
                        value={form.description}
                        onChange={(e) => setForm((f) => ({...f, description: e.target.value}))}
                    />

                    {form.invoiceItems.map((item, index) => (
                        <div
                            key={index}
                            className="w-full p-4 mt-4 rounded-lg shadow-md border border-gray-300 bg-white flex flex-col gap-4"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-medium">افزودن آیتم {index + 1}</h3>

                                <button
                                    type="button"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() =>
                                        setForm(f => ({
                                            ...f,
                                            invoiceItems: f.invoiceItems.filter((_, i) => i !== index)
                                        }))
                                    }
                                >
                                    <MdMinimize className="w-6 h-6" />
                                </button>
                            </div>

                            <Input
                                label="کالا یا خدمت"
                                name="fullName"
                                value={item.fullName}
                                onChange={(e) => handleItemChange(index, 'fullName', e.target.value)}
                            />

                            <Input
                                label="مقدار"
                                name="quantity"
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            />

                            <Input
                                label="واحد"
                                name="quantityMetric"
                                value={item.quantityMetric}
                                onChange={(e) => handleItemChange(index, 'quantityMetric', e.target.value)}
                            />

                            <Input
                                label="قیمت"
                                name="price"
                                type="number"
                                value={item.price}
                                onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                            />

                            <Input
                                label="توضیحات"
                                name="itemDescription"
                                value={item.description}
                                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            />
                        </div>
                    ))}


                    {/*{form.invoiceItems.map((item, index) => (*/}
                    {/*    <div key={index} className="!p-4 !mt-4 !rounded-lg shadow-md">*/}
                    {/*        <div className="flex justify-between items-center">*/}
                    {/*            <h3 className="text-lg font-medium mb-3">*/}
                    {/*                افزودن آیتم {index + 1}*/}
                    {/*            </h3>*/}
                    
                    {/*            /!* دکمه حذف در صورت نیاز *!/*/}
                    {/*            <button*/}
                    {/*                type="button"*/}
                    {/*                onClick={() =>*/}
                    {/*                    setForm(f => ({*/}
                    {/*                        ...f,*/}
                    {/*                        invoiceItems: f.invoiceItems.filter((_, i) => i !== index)*/}
                    {/*                    }))*/}
                    {/*                }*/}
                    {/*            >*/}
                    {/*                <MdMinimize className="w-5 h-5"/>*/}
                    {/*            </button>*/}
                    {/*        </div>*/}
                    
                    {/*        /!* کالا یا خدمت *!/*/}
                    {/*        <Input*/}
                    {/*            label="کالا یا خدمت"*/}
                    {/*            name="fullName"*/}
                    {/*            value={item.fullName}*/}
                    {/*            onChange={(e) => handleItemChange(index, 'fullName', e.target.value)}*/}
                    {/*        />*/}
                    
                    {/*        /!* مقدار *!/*/}
                    {/*        <Input*/}
                    {/*            label="مقدار"*/}
                    {/*            name="quantity"*/}
                    {/*            type="number"*/}
                    {/*            value={item.quantity}*/}
                    {/*            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}*/}
                    {/*        />*/}
                    
                    {/*        /!* واحد *!/*/}
                    {/*        <Input*/}
                    {/*            label="واحد"*/}
                    {/*            name="quantityMetric"*/}
                    {/*            value={item.quantityMetric}*/}
                    {/*            onChange={(e) => handleItemChange(index, 'quantityMetric', e.target.value)}*/}
                    {/*        />*/}
                    
                    {/*        /!* قیمت *!/*/}
                    {/*        <Input*/}
                    {/*            label="قیمت"*/}
                    {/*            name="price"*/}
                    {/*            type="number"*/}
                    {/*            value={item.price}*/}
                    {/*            onChange={(e) => handleItemChange(index, 'price', e.target.value)}*/}
                    {/*        />*/}
                    
                    {/*        /!* توضیحات آیتم *!/*/}
                    {/*        <Input*/}
                    {/*            label="توضیحات"*/}
                    {/*            name="itemDescription"*/}
                    {/*            value={item.description}*/}
                    {/*            onChange={(e) => handleItemChange(index, 'description', e.target.value)}*/}
                    {/*        />*/}
                    {/*    </div>*/}
                    {/*))}*/}

                    {/* دکمه افزودن آیتم */}
                    <div className="flex justify-center items-center gap-3 !mt-3">
                        {/*<Button label={<MdAdd className="w-5 h-5"/>} type="button" onClick={toggleItemForm} customStyle="w-8 h-8    rounded-full"/>*/}
                        <button
                            type="button"
                            className="w-8 h-8 flex justify-center items-center !rounded-full !bg-green-400 cursor-pointer"
                            onClick={addNewItem}><MdAdd className="w-5 h-5"/></button>
                    </div>

                    {/* دکمه ارسال فرم */}
                    <div className="flex justify-center mt-6">
                        <Button label="ایجاد فاکتور" type="submit" loading={loading}/>
                    </div>
                </form>
            </div>
        </div>
    );
}