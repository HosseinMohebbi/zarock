'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Input from '@/app/components/ui/Input'
import Button from "@/app/components/ui/Button"
import Select from "@/app/components/ui/SelectInput"
import { getAllClients } from "@/services/client/client.service"
import { createProject } from "@/services/project/project.service"
import {Client} from "@/services/client";
import {validate} from "@/services/project/project.validation";

export default function AddProjectFormPage() {
    const params = useParams() as { businessId?: string }
    const router = useRouter()
    const businessId = params?.businessId ?? ''
    const [message, setMessage] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: '',
        employerId: '',
        description: '',
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [clients, setClients] = useState<Client[]>([]);
    const [loadingClients, setLoadingClients] = useState(true)

    // -----------------------------------
    // ⭐ دریافت klient ها از API
    // -----------------------------------
    useEffect(() => {
        const loadClients = async () => {
            setLoadingClients(true);
            try {
                const data = await getAllClients({ page: 1, pageSize: 200 }, businessId);
                console.log(data);
                setClients(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingClients(false);
            }
        };

        if (businessId) loadClients();
    }, [businessId]);



    function handleCancelForm() {
        router.push(`/business/${businessId}/projects`)
    }

    async function handleSubmit(ev?: React.FormEvent) {
        ev?.preventDefault()

        // اعتبارسنجی ساده
        const v = validate(form)
        if (Object.keys(v).length) {
            setErrors(v)
            return
        }

        if (!businessId) {
            setMessage('شناسه کسب‌وکار پیدا نشد');
            return;
        }

        try {
            await createProject(businessId, {
                name: form.name,
                employerId: form.employerId,
                description: form.description,
                tags: []
            })

            router.push(`/business/${businessId}/projects`)

        } catch (err) {
            console.error("Create project failed", err)
        }
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

                    {/* انتخاب کارفرما */}
                    <Select
                        label="کارفرما"
                        value={form.employerId}
                        onChange={val => setForm(f => ({ ...f, employerId: val }))}
                        placeholder={loadingClients ? "در حال بارگذاری..." : "انتخاب کنید"}
                        options={clients.map(c => ({
                            value: c.id,
                            label: c.fullname,
                        }))}
                        error={errors.employerId}
                    />

                    {/* توضیحات */}
                    <Input
                        label="توضیحات"
                        name="description"
                        value={form.description}
                        onChange={e => setForm(f => ({...f, description: e.target.value}))}
                        error={errors.description}
                    />

                    <div className="flex justify-end items-center gap-3 !mt-3">
                        <Button label="لغو" type="button" onClick={handleCancelForm}/>
                        <Button label="افزودن" type="submit"/>
                    </div>
                </form>
            </div>
        </div>
    )
}

