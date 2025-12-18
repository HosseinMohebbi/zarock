'use client'
import React, {useState} from 'react'
import {useParams, useRouter} from 'next/navigation'
import Input from '@/app/components/ui/Input'
import {itemType} from "@/services/item/item.types";
import {createItem} from '@/services/item/item.service'
import Button from "@/app/components/ui/Button";
import {toast} from "react-toastify";
import {validate} from "@/services/item/item.validation"
import {useDispatch} from "react-redux";
import {clearItems} from "@/app/store/itemsSlice";

type FormState = {
    name: string
    group: string
    unit: string
    defaultUnitPrice: string
    type: itemType
    tags: string[]
    tagInput: string
    description: string
}

export default function AddItemFormPage() {
    const params = useParams() as { businessId?: string }
    const router = useRouter()
    const businessId = params?.businessId ?? ''
    const dispatch = useDispatch()

    const [form, setForm] = useState<FormState>({
        name: '',
        group: '',
        unit: '',
        defaultUnitPrice: '',
        type: 'Merchandise',
        tags: [],
        tagInput: '',
        description: '',
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    
    async function handleSubmit(ev?: React.FormEvent) {
        ev?.preventDefault()
        setMessage(null)
        const v = validate(form)
        if (Object.keys(v).length) {
            setErrors(v)
            return
        }
        if (!businessId) {
            setMessage('شناسه کسب‌وکار پیدا نشد')
            return
        }

        setLoading(true)
        setErrors({})
        try {
            const payload = {
                name: form.name.trim(),
                group: form.group.trim(),
                type: form.type,
                tags: form.tags,
                defaultUnitPrice: Number(form.defaultUnitPrice) || 0,
                unit: form.unit.trim(),
                description: form.description.trim(),
            }
            await createItem(businessId, payload);
            dispatch(clearItems());
            toast.success("کالا با موفقیت اضافه شد");

            router.push(`/business/${businessId}/items`)

            setForm({
                name: '',
                group: '',
                unit: '',
                defaultUnitPrice: '',
                type: 'Merchandise',
                tags: [],
                tagInput: '',
                description: '',
            })
        } catch (err: any) {
            console.error(err)
            toast.error("خطا در افزودن کالا/خدمت")
            setMessage(err?.message ?? 'خطا در ایجاد کالا')
        } finally {
            setLoading(false)
        }
    }
    
    function handleCancelForm() {
        router.push(`/business/${businessId}/items`)
    }

    return (
        <div className="w-full flex justify-center !px-4 !pt-24">
            <div className="w-full max-w-lg mx-auto !p-6 bg-background text-foreground rounded-lg shadow">
                <h2 className="text-xl font-semibold !mb-4 text-center">ایجاد کالا / خدمت جدید</h2>

                {message && (
                    <div className="!mb-4 text-sm text-center">
                <span className="inline-block !px-3 !py-1 bg-green-100 text-green-800 rounded">
                    {message}
                </span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    <Input
                        label="گروه"
                        name="group"
                        value={form.group}
                        onChange={e => setForm(f => ({...f, group: e.target.value}))}
                        error={errors.group}
                    />
                    
                    <Input
                        label="زیرگروه"
                        name="name"
                        value={form.name}
                        onChange={e => setForm(f => ({...f, name: e.target.value}))}
                    />
                    
                    <Input
                        label="واحد"
                        name="unit"
                        value={form.unit}
                        onChange={e => setForm(f => ({...f, unit: e.target.value}))}
                        error={errors.unit}
                    />
                    
                    <Input
                        label="قیمت واحد"
                        name="defaultUnitPrice"
                        type="number"
                        value={form.defaultUnitPrice}
                        onChange={e => setForm(f => ({...f, defaultUnitPrice: e.target.value}))}
                        error={errors.defaultUnitPrice}
                    />
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium">نوع</label>

                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 text-lg">
                                <input
                                    type="radio"
                                    name="type"
                                    value="Merchandise"
                                    checked={form.type === 'Merchandise'}
                                    onChange={() => setForm(f => ({...f, type: 'Merchandise'}))}
                                    className="accent-primary"
                                />
                                <span>کالا</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="type"
                                    value="Service"
                                    checked={form.type === 'Service'}
                                    onChange={() => setForm(f => ({...f, type: 'Service'}))}
                                    className="accent-primary"
                                />
                                <span>خدمت</span>
                            </label>
                        </div>
                    </div>
                    
                    <Input
                        label="توضیحات"
                        name="description"
                        type="text"
                        value={form.description}
                        onChange={e => setForm(f => ({...f, description: e.target.value}))}
                    />
                    
                    <div className="flex justify-end items-center gap-3 !mt-3">
                        <Button label="لغو" type="button" onClick={handleCancelForm} customStyle="!bg-danger"/>
                        <Button label="ذخیره" type="submit" customStyle="!bg-confirm"/>
                    </div>
                </form>
            </div>
        </div>
    )
}