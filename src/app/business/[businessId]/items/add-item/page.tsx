// TypeScript (React / Next client component)
'use client'

import React, {useState} from 'react'
import {useParams, useRouter} from 'next/navigation'
import Input from '@/app/components/ui/Input'
// import {createItem, itemType} from '@/services/item'
import {itemType} from "@/services/item/item.types";
import {createItem} from '@/services/item/item.service'
import Button from "@/app/components/ui/Button";
import {toast} from "react-toastify";

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

    function validate() {
        const e: Record<string, string> = {}
        if (!form.group.trim()) e.group = 'این فیلد الزامی است'
        if (!form.unit.trim()) e.unit = 'این فیلد الزامی است'
        const price = Number(form.defaultUnitPrice)
        if (isNaN(price) || price < 0) e.defaultUnitPrice = 'قیمت معتبر نیست'
        return e
    }

    async function handleSubmit(ev?: React.FormEvent) {
        ev?.preventDefault()
        setMessage(null)
        const v = validate()
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
            await createItem(businessId, payload)
            toast.success("آیتم با موفقیت اضافه شد");
            // setMessage('کالا با موفقیت ایجاد شد')
            // در صورت نیاز به هدایت بعد از ایجاد:
            router.push(`/business/${businessId}/items`)
            // یا پاک کردن فرم:
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
            setMessage(err?.message ?? 'خطا در ایجاد کالا')
        } finally {
            setLoading(false)
        }
    }

    function handleAddTagFromInput() {
        const val = form.tagInput.trim()
        if (!val) return
        const newTags = val.split(',').map(t => t.trim()).filter(Boolean)
        setForm(f => ({...f, tags: Array.from(new Set([...f.tags, ...newTags])), tagInput: ''}))
    }

    function handleRemoveTag(tag: string) {
        setForm(f => ({...f, tags: f.tags.filter(t => t !== tag)}))
    }

    function handleCancelForm() {
        router.push(`/business/${businessId}/items`)
    }

    return (
        <div className="w-full flex justify-center !px-4">
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
                    {/* گروه */}
                    <Input
                        label="گروه"
                        name="group"
                        value={form.group}
                        onChange={e => setForm(f => ({...f, group: e.target.value}))}
                        error={errors.group}
                    />

                    {/* زیرگروه */}
                    <Input
                        label="زیرگروه"
                        name="name"
                        value={form.name}
                        onChange={e => setForm(f => ({...f, name: e.target.value}))}
                    />

                    {/* واحد */}
                    <Input
                        label="واحد"
                        name="unit"
                        value={form.unit}
                        onChange={e => setForm(f => ({...f, unit: e.target.value}))}
                        error={errors.unit}
                    />

                    {/* قیمت واحد */}
                    <Input
                        label="قیمت واحد"
                        name="defaultUnitPrice"
                        type="number"
                        value={form.defaultUnitPrice}
                        onChange={e => setForm(f => ({...f, defaultUnitPrice: e.target.value}))}
                        error={errors.defaultUnitPrice}
                    />

                    {/* نوع */}
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

                    {/* تگ‌ها */}
                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium">تگ‌ها</label>

                        <div className="flex gap-2 items-center">
                            <Input
                                value={form.tagInput}
                                onChange={e => setForm(f => ({...f, tagInput: e.target.value}))}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        handleAddTagFromInput()
                                    }
                                }}
                                onBlur={handleAddTagFromInput}
                            />

                            <button
                                type="button"
                                onClick={handleAddTagFromInput}
                                className="!px-3 !py-2 bg-gray-100 rounded"
                            >
                                افزودن
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 !mt-2">
                            {form.tags.map(t => (
                                <span
                                    key={t}
                                    className="flex items-center gap-2 bg-muted text-foreground !px-2 !py-1 !rounded text-sm"
                                >
                            {t}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(t)}
                                        className="text-red-500"
                                    >
                                ×
                            </button>
                        </span>
                            ))}
                        </div>
                    </div>

                    {/* توضیحات */}
                    <Input
                        label="توضیحات"
                        name="description"
                        type="text"
                        value={form.description}
                        onChange={e => setForm(f => ({...f, description: e.target.value}))}
                    />

                    {/* دکمه‌ها */}
                    <div className="flex justify-end items-center gap-3 !mt-3">
                        <Button label="لغو" type="button" onClick={handleCancelForm}/>
                        <Button label="افزودن" type="submit"/>
                    </div>
                </form>
            </div>
        </div>
    )
}