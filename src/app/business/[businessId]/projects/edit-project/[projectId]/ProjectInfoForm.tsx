'use client'
import React, {useEffect, useState} from 'react'
import {useParams, useRouter} from 'next/navigation'
import Input from '@/app/components/ui/Input'
import Button from '@/app/components/ui/Button'
import Select from '@/app/components/ui/SelectInput'
import {getProjectById, updateProject ,deleteProject} from '@/services/project/project.service'
import {getAllClients} from '@/services/client/client.service'
import {Client} from '@/services/client/client.types'
import {AddProjectPayload} from '@/services/project/project.types'
import {MdDelete} from "react-icons/md";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import {toast} from "react-toastify";

export default function EditProjectPage() {

    const params = useParams() as { businessId: string; projectId: string }
    const router = useRouter()

    const businessId = params.businessId
    const projectId = params.projectId

    const [loading, setLoading] = useState(true)
    const [clients, setClients] = useState<Client[]>([])
    const [showConfirm, setShowConfirm] = useState(false);

    const [form, setForm] = useState({
        name: '',
        description: '',
        progress: '',
        client: '',
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        async function load() {
            try {
                setLoading(true)

                const clientsData = await getAllClients(
                    {page: 1, pageSize: 500},
                    businessId
                )
                setClients(clientsData)

                const proj = await getProjectById(businessId, projectId)

                setForm({
                    name: proj.name,
                    description: proj.description ?? '',
                    progress: proj.progress?.toString() ?? '0',
                    client: proj.client?.id ?? '',
                })

            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [businessId, projectId])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        const errs: Record<string, string> = {}
        if (!form.name) errs.name = 'نام پروژه الزامی است'
        if (!form.client) errs.client = 'کارفرما را انتخاب کنید'
        if (!form.progress) errs.progress = 'پیشرفت الزامی است'

        if (Object.keys(errs).length) {
            setErrors(errs)
            return
        }

        const payload: AddProjectPayload = {
            name: form.name,
            description: form.description,
            progress: Number(form.progress),
            employerId: form.client,
            tags: [],
        }

        try {
            await updateProject(businessId, projectId, payload)
            router.push(`/business/${businessId}/projects`)
        } catch (err) {
            console.error('Update project failed', err)
        }
    }

    function handleCancel() {
        router.push(`/business/${businessId}/projects`)
    }

    function handleDelete() {
        setShowConfirm(true);
    }

    async function confirmDelete() {
        try {
            setShowConfirm(false);

            await deleteProject(businessId, projectId);

            toast.success("پروژه با موفقیت حذف شد");

            router.push(`/business/${businessId}/projects`);
        } catch (err) {
            toast.error("حذف پروژه با خطا مواجه شد");
            console.error(err);
        }
    }

    if (loading) {
        return (
            <div className="w-full flex justify-center pt-40 text-center">
                <p>در حال بارگذاری...</p>
            </div>
        )
    }

    return (
        <div className="w-full flex justify-center !px-4 !pt-24">
            <div className="w-full max-w-lg mx-auto !p-6 bg-background text-foreground rounded-lg shadow">
                <div className="relative w-full flex items-start">
                    <div onClick={handleDelete} className="absolute right-0 text-danger cursor-pointer">
                        <MdDelete className='w-6 h-6'/>
                    </div>
                    <h2 className="!mx-auto text-xl font-semibold !mb-4 text-center">ویرایش پروژه</h2>
                </div>

                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

                    <Input
                        label="نام پروژه"
                        name="name"
                        value={form.name}
                        onChange={(e) =>
                            setForm((f) => ({...f, name: e.target.value}))
                        }
                        error={errors.name}
                    />

                    <Select
                        label="کارفرما"
                        value={form.client}
                        onChange={(v) =>
                            setForm((f) => ({...f, client: v}))
                        }
                        options={clients.map((c) => ({
                            value: c.id,
                            label: c.fullname,
                        }))}
                        placeholder="انتخاب کنید"
                        error={errors.client}
                    />

                    <Input
                        label="پیشرفت"
                        type="number"
                        name="progress"
                        value={form.progress}
                        onChange={(e) =>
                            setForm((f) => ({...f, progress: e.target.value}))
                        }
                        error={errors.progress}
                    />

                    <Input
                        label="توضیحات"
                        name="description"
                        value={form.description}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                description: e.target.value,
                            }))
                        }
                        error={errors.description}
                    />

                    <div className="flex justify-end items-center gap-3 !mt-3">
                        <Button label="لغو" type="button" onClick={handleCancel} customStyle="!bg-danger"/>
                        <Button label="ویرایش" type="submit" customStyle="!bg-confirm"/>
                    </div>
                </form>
            </div>
            <ConfirmModal title="حذف پروژه" isOpen={showConfirm}
                          message="آیا از حذف این پروژه مطمئن هستید؟ این عملیات غیر قابل بازگشت است."
                          onConfirm={confirmDelete} onCancel={() => setShowConfirm(false)}/>
        </div>
    )
}
