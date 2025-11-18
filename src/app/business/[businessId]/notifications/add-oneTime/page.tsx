'use client';

import React, {useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {toast} from "react-toastify";


import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import DatePicker from "react-multi-date-picker";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
dayjs.extend(jalaliday);
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import {createOneTimeNotif} from "@/services/notification/oneTimeNotif/notification.service";
import {AddOneTimeNotifPayload, FieldErrors} from "@/services/notification/oneTimeNotif/notification.types";


export default function OneTimeNotifCreatePage() {
    const [description, setDescription] = useState('');
    const [notificationDate, setNotificationDate] = useState('');
    const [dayBeforeNotification, setDayBeforeNotification] = useState('');
    const [isActive, setIsActive] = useState(true);

    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [loading, setLoading] = useState(false);

    const params = useParams() as { businessId?: string };
    const businessId = params.businessId ?? '';
    const router = useRouter();

    // ------------------ VALIDATION ------------------
    const validate = () => {
        const errors: FieldErrors = {};

        if (!description.trim()) errors.description = "توضیحات الزامی است";
        if (!notificationDate.trim()) errors.notificationDate = "تاریخ الزامی است";
        if (!dayBeforeNotification.trim() || Number(dayBeforeNotification) < 0)
            errors.dayBeforeNotification = "تعداد روز را صحیح وارد کنید";

        return errors;
    };

    // ------------------ SUBMIT ------------------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const errs = validate();
        setFieldErrors(errs);
        if (Object.keys(errs).length > 0) return;

        const payload: AddOneTimeNotifPayload = {
            description: description.trim(),
            notificationDate,
            dayBeforeNotification: Number(dayBeforeNotification),
            isActive
        };

        try {
            setLoading(true);
            await createOneTimeNotif(businessId, payload);
            toast.success("اعلان با موفقیت ایجاد شد");

            router.push(`/business/${businessId}/notifications`);
        } catch (err: any) {
            toast.error(err?.message || "خطای سرور");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push(`/business/${businessId}/notifications`);
    };

    return (
        <div className="w-full flex justify-center !px-4">
            <div className="w-full max-w-lg mx-auto !p-6 bg-background text-foreground rounded-lg shadow">

                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-semibold text-center w-full">
                        ایجاد اعلان یک‌بار
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* توضیحات */}
                    <Input
                        label="توضیحات"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        error={fieldErrors.description}
                    />

                    {/* تاریخ اعلان */}
                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium">تاریخ فاکتور</label>

                        <DatePicker
                            calendar={persian}
                            locale={persian_fa}
                            value={
                                notificationDate
                                    ? dayjs(notificationDate).calendar('jalali').toDate()
                                    : null
                            }
                            onChange={(notificationDate) =>
                                setNotificationDate(notificationDate ? notificationDate.toDate().toISOString() : "")
                            }
                            format="YYYY/MM/DD"
                            className="w-full border rounded-md px-3 py-2 bg-white"
                        />
                    </div>

                    {/* روز قبل از اعلان */}
                    <Input
                        label="تعداد روز قبل از اعلان"
                        type="number"
                        min={0}
                        name="dayBeforeNotification"
                        value={dayBeforeNotification}
                        onChange={(e) => setDayBeforeNotification(e.target.value)}
                        error={fieldErrors.dayBeforeNotification}
                    />

                    {/* فعال بودن */}
                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium">وضعیت اعلان</label>

                        <label className="flex items-center gap-2 text-base">
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="w-4 h-4 accent-primary"
                            />
                            <span>فعال باشد؟</span>
                        </label>
                    </div>

                    {/* دکمه‌ها */}
                    <div className="flex justify-end items-center gap-3 !mt-3">
                        <Button
                            label="لغو"
                            type="button"
                            onClick={handleCancel}
                        />

                        <Button
                            label={loading ? "در حال ثبت..." : "ثبت اعلان"}
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
