'use client';

import {useParams, useRouter} from "next/navigation";
import Button from "@/app/components/ui/Button";
import {MdAdd, MdNotificationImportant} from "react-icons/md";
import {useEffect, useState} from "react";

import {getOneTimeNotif} from "@/services/notification/oneTimeNotif/notification.service";
import {AddOneTimeNotifResponse} from "@/services/notification/oneTimeNotif/notification.types";

import {getMonthlyNotif} from "@/services/notification/monthlyNotif/notification.service";
import {AddMonthlyNotifResponse} from "@/services/notification/monthlyNotif/notification.types";

import {getCheckNotif} from "@/services/notification/checkNotif/notification.service";
import {AddCheckNotifResponse} from "@/services/notification/checkNotif/notification.types";

import dayjs from "dayjs";
import jalaliday from "jalaliday";
import "dayjs/locale/fa";

dayjs.extend(jalaliday);

// 📅 فقط تاریخ شمسی
function formatJalali(input?: string | number | Date) {
    const d = dayjs(input);
    if (!d.isValid()) return "";
    return d.calendar("jalali").locale("fa").format("YYYY/MM/DD");
}

export default function NotificationsPage() {
    const params = useParams() as { businessId?: string };
    const router = useRouter();
    const businessId = params.businessId ?? '';

    // States
    const [oneTimeNotifs, setOneTimeNotifs] = useState<AddOneTimeNotifResponse[]>([]);
    const [monthlyNotifs, setMonthlyNotifs] = useState<AddMonthlyNotifResponse[]>([]);
    const [checkNotifs, setCheckNotifs] = useState<AddCheckNotifResponse[]>([]);

    const [loadingOne, setLoadingOne] = useState(true);
    const [loadingMonthly, setLoadingMonthly] = useState(true);
    const [loadingCheck, setLoadingCheck] = useState(true);

    useEffect(() => {
        async function fetchAll() {
            try {
                // One-time
                const one = await getOneTimeNotif(businessId, {page: 1, pageSize: 50});
                setOneTimeNotifs(one);
            } catch {}
            setLoadingOne(false);

            try {
                // Monthly
                const monthly = await getMonthlyNotif(businessId, {page: 1, pageSize: 50});
                setMonthlyNotifs(monthly);
            } catch {}
            setLoadingMonthly(false);

            try {
                // Check
                const checks = await getCheckNotif(businessId, {page: 1, pageSize: 50});
                setCheckNotifs(checks);
            } catch {}
            setLoadingCheck(false);
        }

        fetchAll();
    }, [businessId]);

    // ---------------------------- UI ----------------------------

    return (
        <div className="w-full flex justify-center !px-4 !pt-24">
            <div className="w-full max-w-8xl mx-auto p-6 bg-background text-foreground rounded-lg shadow">

                <h2 className="text-2xl font-semibold text-center mb-10">مدیریت اعلانات</h2>

                <div className="flex flex-col items-center gap-6 !p-4">

                    {/* ---------------------------------------------------------- */}
                    {/* اعلان‌های یک بار */}
                    {/* ---------------------------------------------------------- */}
                    <div className="w-full !p-5 border !rounded-xl bg-card shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-3">اعلان‌های یک‌بار</h3>

                            <div className="border !rounded-lg !p-4 bg-background shadow-sm text-sm">

                                {loadingOne ? (
                                    <p className="text-gray-500 text-center">در حال بارگذاری...</p>
                                ) : oneTimeNotifs.length === 0 ? (
                                    <p className="text-gray-500 text-center">هیچ اعلان یک‌بار ثبت نشده است</p>
                                ) : (
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {oneTimeNotifs.map((n) => (
                                            <li
                                                key={n.id}
                                                className={`flex flex-col gap-4 !p-3 !rounded-lg ${n.isActive ? "bg-card" : "bg-muted"} border shadow-sm text-foreground`}
                                            >
                                                <div className="flex justify-start items-center gap-1">
                                                    <p className="font-medium">توضیحات:</p>
                                                    <p className="text-xs">{n.description}</p>
                                                </div>
                                                <div className="flex justify-start items-center gap-1">
                                                    <p className="font-medium">تاریخ:</p>
                                                    <p className="text-xs">{formatJalali(n.notificationDate)}</p>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className="font-medium">{n.dayBeforeNotification} روز قبل</p>
                                                    <MdNotificationImportant className={`w-6 h-6 ${n.isActive ? "text-confirm" : "text-danger"}`} />
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                            </div>
                        </div>

                        <Button
                            label={<MdAdd className="w-6 h-6" />}
                            onClick={() => router.push(`/business/${businessId}/notifications/one-time`)}
                            className="w-full mt-4 !py-3 !rounded-lg bg-white shadow hover:bg-gray-50"
                        />
                    </div>

                    {/* ---------------------------------------------------------- */}
                    {/* اعلان‌های ماهانه */}
                    {/* ---------------------------------------------------------- */}
                    <div className="w-full !p-5 border !rounded-xl bg-card shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-3">اعلان‌های ماهانه</h3>

                            <div className="border !rounded-lg !p-4 bg-background shadow-sm text-sm">

                                {loadingMonthly ? (
                                    <p className="text-gray-500 text-center">در حال بارگذاری...</p>
                                ) : monthlyNotifs.length === 0 ? (
                                    <p className="text-gray-500 text-center">هیچ اعلان ماهانه‌ای ثبت نشده است</p>
                                ) : (
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {monthlyNotifs.map((n) => (
                                            <li
                                                key={n.id}
                                                className={`flex flex-col gap-4 !p-3 !rounded-lg ${n.isActive ? "bg-card" : "bg-muted"} border shadow-sm`}
                                            >
                                                <div className="flex justify-start items-center gap-1">
                                                    <p className="font-medium">عنوان:</p>
                                                    <p className="text-xs">{n.title}</p>
                                                </div>

                                                <div className="flex justify-start items-center gap-1">
                                                    <p className="font-medium">روز ماه:</p>
                                                    <p className="text-xs">{n.dayOfMonth}</p>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <p className="font-medium">{n.dayBeforeNotification} روز قبل</p>
                                                    <MdNotificationImportant className={`w-6 h-6 ${n.isActive ? "text-confirm" : "text-danger"}`} />
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                            </div>
                        </div>

                        <Button
                            label={<MdAdd className="w-6 h-6" />}
                            onClick={() => router.push(`/business/${businessId}/notifications/monthly`)}
                            className="w-full mt-4 !py-3 !rounded-lg bg-white shadow hover:bg-gray-50"
                        />
                    </div>

                    {/* ---------------------------------------------------------- */}
                    {/* اعلان‌های چک */}
                    {/* ---------------------------------------------------------- */}
                    <div className="w-full !p-5 border !rounded-xl bg-card shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-3">اعلان‌های چک</h3>

                            <div className="border !rounded-lg !p-4 bg-background shadow-sm text-sm">

                                {loadingCheck ? (
                                    <p className="text-gray-500 text-center">در حال بارگذاری...</p>
                                ) : checkNotifs.length === 0 ? (
                                    <p className="text-gray-500 text-center">هیچ اعلان چکی ثبت نشده است</p>
                                ) : (
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {checkNotifs.map((n) => (
                                            <li
                                                key={n.id}
                                                className={`flex flex-col gap-4 !p-3 !rounded-lg ${n.isActive ? "bg-card" : "bg-muted"} border shadow-sm`}
                                            >
                                                <div className="flex justify-start items-center gap-1">
                                                    <p className="font-medium">مبلغ:</p>
                                                    <p className="text-xs">{n.amount}</p>
                                                </div>

                                                <div className="flex justify-start items-center gap-1">
                                                    <p className="font-medium">تاریخ چک:</p>
                                                    <p className="text-xs">{formatJalali(n.checkDate)}</p>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <p className="font-medium">{n.dayBeforeNotification} روز قبل</p>
                                                    <MdNotificationImportant className={`w-6 h-6 ${n.isActive ? "text-confirm" : "text-danger"}`} />
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                            </div>
                        </div>

                        <Button
                            label={<MdAdd className="w-6 h-6" />}
                            onClick={() => router.push(`/business/${businessId}/notifications/cheque`)}
                            className="w-full mt-4 !py-3 !rounded-lg bg-white shadow hover:bg-gray-50"
                        />
                    </div>

                </div>

            </div>
        </div>
    );
}

// 'use client';
//
// import {useParams, useRouter} from "next/navigation";
// import Button from "@/app/components/ui/Button";
// import {MdAdd, MdNotificationImportant} from "react-icons/md";
// import {useEffect, useState} from "react";
// import {getOneTimeNotif} from "@/services/notification/oneTimeNotif/notification.service";
// import {AddOneTimeNotifResponse} from "@/services/notification/oneTimeNotif/notification.types";
//
// import dayjs from "dayjs";
// import jalaliday from "jalaliday";
// import "dayjs/locale/fa";
//
// dayjs.extend(jalaliday);
//
// // 📅 فقط تاریخ شمسی (بدون ساعت)
// function formatJalali(input?: string | number | Date) {
//     const d = dayjs(input);
//     if (!d.isValid()) return "";
//     return d.calendar("jalali").locale("fa").format("YYYY/MM/DD");
// }
//
// export default function NotificationsPage() {
//     const params = useParams() as { businessId?: string };
//     const router = useRouter();
//     const businessId = params.businessId ?? '';
//
//     const [oneTimeNotifs, setOneTimeNotifs] = useState<AddOneTimeNotifResponse[]>([]);
//     const [loading, setLoading] = useState(true);
//
//     useEffect(() => {
//         async function fetchData() {
//             try {
//                 const data = await getOneTimeNotif(businessId, {page: 1, pageSize: 20});
//                 console.log(data);
//                 setOneTimeNotifs(data);
//             } catch (e) {
//                 console.error("Error fetching one-time notifs:", e);
//             } finally {
//                 setLoading(false);
//             }
//         }
//
//         fetchData();
//     }, [businessId]);
//
//     return (
//         <div className="w-full flex justify-center !px-4">
//             <div className="w-full max-w-8xl mx-auto p-6 bg-background text-foreground rounded-lg shadow">
//
//                 {/* عنوان صفحه */}
//                 <h2 className="text-2xl font-semibold text-center mb-10">
//                     مدیریت اعلانات
//                 </h2>
//
//                 {/* سه کارت اعلانات */}
//                 <div className="flex flex-col items-center gap-6 !p-4">
//
//                     {/* اعلان‌های یک‌بار */}
//                     <div className="w-full !p-5 border !rounded-xl bg-card shadow-sm flex flex-col justify-between">
//                         <div>
//                             <h3 className="text-lg font-semibold mb-3">اعلان‌های یک‌بار</h3>
//
//                             {/* محتوا */}
//                             <div className="border !rounded-lg !p-4 bg-background shadow-sm text-sm">
//
//                                 {loading ? (
//                                     <p className="text-gray-500 text-center">در حال بارگذاری...</p>
//                                 ) : oneTimeNotifs.length === 0 ? (
//                                     <p className="text-gray-500 text-center">هیچ اعلان یک‌بار ثبت نشده است</p>
//                                 ) : (
//                                     // <ul className="flex flex-col gap-4 space-y-3 sm:flex-row flex-wrap">
//                                     <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
//                                         {oneTimeNotifs.map((n) => (
//                                             <li
//                                                 key={n.id}
//                                                 className={`flex flex-col gap-4 !p-3 !rounded-lg ${n.isActive ? "bg-card" : "bg-muted"} border shadow-sm text-foreground text-right`}
//                                             >
//                                                 <div className="flex justify-start items-center gap-1">
//                                                 <p className="font-medium">توضیحات:</p>
//                                                     <p className="text-xs">{n.description}</p>
//                                                 </div>
//                                                 <div className="flex justify-start items-center gap-1">
//                                                     <p className="font-medium">تاریخ:</p>
//                                                     <p className="text-xs">{formatJalali(n.notificationDate)}</p>
//                                                 </div>
//                                                 <div className="flex justify-between items-center">
//                                                     <p className="font-medium">{n.dayBeforeNotification} روز قبل</p>
//                                                     <MdNotificationImportant className={`w-6 h-6 ${n.isActive ? "text-confirm" : "text-danger"}`} />
//                                                 </div>
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 )}
//
//                             </div>
//                         </div>
//
//                         <Button
//                             label={<MdAdd className="w-6 h-6"/>}
//                             onClick={() => router.push(`/business/${businessId}/notifications/one-time`)}
//                             className="w-full mt-4 py-3 rounded-lg bg-white shadow hover:bg-gray-50"
//                         />
//                     </div>
//
//                     {/* اعلان‌های ماهانه */}
//                     <div className="p-5 border rounded-xl bg-card shadow-sm flex flex-col justify-between">
//                         <div>
//                             <h3 className="text-lg font-semibold mb-3">اعلان‌های ماهانه</h3>
//                             <div
//                                 className="border rounded-lg p-4 bg-background shadow-sm text-sm text-gray-500 text-center">
//                                 هیچ اعلان ماهانه‌ای ثبت نشده است
//                             </div>
//                         </div>
//
//                         <Button
//                             label={<MdAdd className="w-6 h-6"/>}
//                             onClick={() => router.push(`/business/${businessId}/notifications/monthly`)}
//                             className="w-full mt-4 py-3 rounded-lg bg-white shadow hover:bg-gray-50"
//                         />
//                     </div>
//
//                     {/* اعلان‌های چک */}
//                     <div className="p-5 border rounded-xl bg-card shadow-sm flex flex-col justify-between">
//                         <div>
//                             <h3 className="text-lg font-semibold mb-3">اعلان‌های چک</h3>
//                             <div
//                                 className="border rounded-lg p-4 bg-background shadow-sm text-sm text-gray-500 text-center">
//                                 هیچ اعلان چک ثبت نشده است
//                             </div>
//                         </div>
//
//                         <Button
//                             label={<MdAdd className="w-6 h-6"/>}
//                             onClick={() => router.push(`/business/${businessId}/notifications/cheque`)}
//                             className="w-full mt-4 py-3 rounded-lg bg-white shadow hover:bg-gray-50"
//                         />
//                     </div>
//
//                 </div>
//
//             </div>
//         </div>
//     );
// }
