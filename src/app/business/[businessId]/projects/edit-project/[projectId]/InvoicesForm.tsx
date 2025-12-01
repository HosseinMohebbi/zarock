'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Input from '@/app/components/ui/Input'
import Button from "@/app/components/ui/Button"

export default function InvoicesForm() {
    const params = useParams() as { businessId?: string }
    const router = useRouter()
    const businessId = params?.businessId ?? ''

    // حالت اولیه فرم (بدون لاجیک)
    const [form, setForm] = useState({
        name: '',
        client: '',
        description: '',
        progress: '',
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    function handleCancelForm() {
        router.push(`/business/${businessId}/projects`)
    }

    function handleSubmit(ev?: React.FormEvent) {
        ev?.preventDefault()
        // لاجیک بعداً اضافه می‌شود
    }

    return (
        <div className="w-full flex justify-center !px-4 !pt-24">
            <div className="w-full max-w-lg mx-auto !p-6 bg-background text-foreground rounded-lg shadow">
                <h2 className="text-xl font-semibold !mb-4 text-center">ایجاد پروژه جدید</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* نام پروژه */}
                    <Input
                        label="نام پروژه"
                        name="name"
                        value={form.name}
                        onChange={e => setForm(f => ({...f, name: e.target.value}))}
                        error={errors.name}
                    />

                    {/* مشتری */}
                    <Input
                        label="کارفرما"
                        name="client"
                        value={form.client}
                        onChange={e => setForm(f => ({...f, client: e.target.value}))}
                        error={errors.client}
                    />

                    <Input
                        label="پیشرفت"
                        name="progress"
                        type="number"
                        value={form.progress}
                        onChange={e => setForm(f => ({...f, progress: e.target.value}))}
                        error={errors.progress}
                    />

                    {/* توضیحات */}
                    <Input
                        label="توضیحات"
                        name="description"
                        value={form.description}
                        onChange={e => setForm(f => ({...f, description: e.target.value}))}
                        error={errors.description}
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