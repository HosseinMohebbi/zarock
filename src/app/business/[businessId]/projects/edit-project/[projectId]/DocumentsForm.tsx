'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/app/components/ui/Button";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import { toast } from "react-toastify";
import { MdDelete, MdImage } from "react-icons/md";

import {
    getProjectDocumentsWithFiles,
    uploadProjectDocument,
    deleteProjectDocument,
} from "@/services/project/project.service";

// تاریخ جلالی
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import "dayjs/locale/fa";
dayjs.extend(jalaliday);

function formatJalali(input?: string | number | Date) {
    const d = dayjs(input);
    if (!d.isValid()) return "";
    return d.calendar("jalali").locale("fa").format("YYYY/MM/DD");
}

export default function ProjectDocumentsPage() {
    const params = useParams() as { businessId: string; projectId: string };
    const projectId = params.projectId;

    const [loading, setLoading] = useState(true);
    const [documents, setDocuments] = useState<any[]>([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [docToRemove, setDocToRemove] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    // -----------------------------------
    // بارگذاری اسناد + URL فایل ها
    async function loadData() {
        setLoading(true);
        try {
            const docs = await getProjectDocumentsWithFiles(projectId, {
                page: 1,
                pageSize: 50
            });

            setDocuments(docs);
        } catch (err) {
            console.error(err);
            toast.error("خطا در بارگذاری اسناد");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // -----------------------------------
    // آپلود سند جدید
    async function handleUploadDocument(evt: React.ChangeEvent<HTMLInputElement>) {
        const file = evt.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            await uploadProjectDocument(projectId, file);

            toast.success("سند با موفقیت آپلود شد");

            await loadData();
        } catch (err) {
            console.error(err);
            toast.error("خطا در آپلود سند");
        } finally {
            evt.target.value = "";
            setUploading(false);
        }
    }

    // -----------------------------------
    // باز کردن مودال حذف سند
    function handleOpenConfirmModal(id: string) {
        setDocToRemove(id);
        setShowConfirm(true);
    }

    // -----------------------------------
    // حذف سند
    async function handleConfirmRemove() {
        if (!docToRemove) return;

        try {
            await deleteProjectDocument(docToRemove);

            setDocuments(prev => prev.filter(doc => doc.id !== docToRemove));

            toast.success("سند حذف شد");
        } catch (err) {
            console.error(err);
            toast.error("خطا در حذف سند");
        } finally {
            setShowConfirm(false);
            setDocToRemove(null);
        }
    }

    // -----------------------------------

    return (
        <div className="flex justify-center w-full !px-4 !pt-24">
            <div className="w-full max-w-2xl !mx-auto">

                {/* HEADER */}
                <div className="flex justify-between items-center !mb-6">
                    <h2 className="text-xl font-semibold">مدارک پروژه</h2>

                    <button
                        type="button"
                        onClick={() => document.getElementById("project-doc-upload")?.click()}
                        disabled={uploading}
                        className="flex gap-2 justify-center items-center bg-cyan-400 text-white text-[20px] font-bold rounded-lg py-[5px] px-[26px]"
                    >
                        {uploading ? "در حال آپلود..." : "+ افزودن سند"}
                    </button>

                    <input
                        id="project-doc-upload"
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleUploadDocument}
                        className="hidden"
                    />
                </div>



                {/* LIST */}
                {loading ? (
                    <div className="text-center !py-10">در حال بارگذاری...</div>
                ) : documents.length === 0 ? (
                    <div className="!p-4 text-center text-gray-500 border !rounded-lg">
                        هنوز هیچ سندی آپلود نشده است.
                    </div>
                ) : (
                    <div className="flex flex-col items-center !px-3 gap-3 !pb-4 overflow-y-auto">
                        {documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="w-full max-w-sm bg-card !p-4 !rounded-lg shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer"
                            >
                                {/* عکس یا PDF */}
                                <div className="w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden !rounded-lg">
                                    {doc.url ? (
                                        doc.extension?.toLowerCase() === ".pdf" ? (
                                            <a
                                                href={doc.url}
                                                target="_blank"
                                                className="text-blue-600 underline"
                                            >
                                                مشاهده PDF
                                            </a>
                                        ) : (
                                            <img
                                                src={doc.url}
                                                className="w-full h-full object-cover"
                                                alt={doc.fileName}
                                            />
                                        )
                                    ) : (
                                        <MdImage className="text-gray-400 w-10 h-10" />
                                    )}
                                </div>

                                {/* INFO */}
                                <div className="!p-3 flex flex-col gap-2">

                                    <div className="flex justify-between items-center">
                                        <div className="font-bold text-lg">
                                            {doc.fileName}
                                            {doc.extension}
                                        </div>

                                        <button
                                            className="cursor-pointer"
                                            onClick={() => handleOpenConfirmModal(doc.id)}
                                            title="حذف سند"
                                        >
                                            <MdDelete className="w-7 h-7 text-danger" />
                                        </button>
                                    </div>

                                    <div className="text-sm text-gray-600">
                                        تاریخ: {formatJalali(doc.createdAt)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={showConfirm}
                title="حذف سند"
                message="آیا از حذف این سند اطمینان دارید؟"
                onCancel={() => setShowConfirm(false)}
                onConfirm={handleConfirmRemove}
            />
        </div>
    );
}
