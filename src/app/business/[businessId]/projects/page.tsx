'use client';

import { useEffect, useState } from "react";
import Loader from "@/app/components/ui/Loader";
import Card from "@/app/components/ui/Card";
import Input from "@/app/components/ui/Input";

import { getAllProjects } from "@/services/project/project.service";
import { ProjectResponse } from "@/services/project/project.types";

import { useParams } from "next/navigation";

export default function ProjectsPage() {
    const params = useParams() as { businessId?: string };
    const businessId = params.businessId ?? "";

    const [projects, setProjects] = useState<ProjectResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const page = 1;
    const pageSize = 50;

    // ------------------------------
    // 🟢 FETCH PROJECTS
    // ------------------------------
    useEffect(() => {
        if (!businessId) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getAllProjects({ page, pageSize }, businessId);
                setProjects(data);
            } catch (err: any) {
                setError(err.message || "خطا در دریافت پروژه‌ها");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [businessId]);

    // ------------------------------
    // 🔥 LOADING → فقط اسپینر
    // ------------------------------
    if (loading) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <Loader />
            </div>
        );
    }

    // ------------------------------
    // ❌ ERROR
    // ------------------------------
    if (error) {
        return (
            <div className="flex items-center justify-center h-[80vh] text-red-500 text-lg">
                {error}
            </div>
        );
    }

    // ------------------------------
    // 📭 EMPTY LIST
    // ------------------------------
    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] gap-3">
                <h2 className="text-gray-500 text-xl">هیچ پروژه‌ای یافت نشد</h2>
            </div>
        );
    }

    // ------------------------------
    // ✅ CONTENT AFTER LOADING
    // ------------------------------
    return (
        <div className="p-4 flex flex-col gap-4">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold">لیست پروژه‌ها</h1>
            </div>

            {/* SEARCH (اگر بعداً فیلتر خواستی اضافه کنیم) */}
            <Input
                type="text"
                placeholder="جستجو در پروژه‌ها..."
                disabled
            />

            {/* PROJECT LIST */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                    <Card
                        key={project.id}
                        customStyle="p-4 border rounded-md cursor-pointer hover:shadow"
                    >
                        <h3 className="font-semibold text-lg">{project.name}</h3>

                        <p className="text-gray-500 text-sm mt-2">
                            {project.description || "- بدون توضیحات -"}
                        </p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
