'use client';
import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {MdAdd} from "react-icons/md";
import {getAllProjects} from "@/services/project/project.service";
import {AddProjectResponse} from "@/services/project/project.types";
import Loader from "@/app/components/ui/Loader";

export default function ProjectsPage() {
    const params = useParams() as { businessId?: string };
    const businessId = params.businessId ?? "";

    const router = useRouter();

    const [projects, setProjects] = useState<AddProjectResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const page = 1;
    const pageSize = 50;

    const handleAddProject = () => {
        router.push(`/business/${businessId}/projects/add-project`);
    };

    const handleOpenProject = (projectId: any) => {
        router.push(`/business/${businessId}/projects/edit-project/${projectId}`);
    };

    useEffect(() => {
        if (!businessId) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getAllProjects({page, pageSize}, businessId);
                setProjects(data);
            } catch (err: any) {
                setError(err.message || "خطا در دریافت پروژه‌ها");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [businessId]);

    if (loading) {
        return (
            <main className="flex items-center justify-center h-screen">
                <Loader/>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex items-center justify-center h-screen">
                <div className="text-red-600 text-lg">{error}</div>
            </main>
        );
    }

    return (
        <main className="!p-4 !pt-24">

            {/* HEADER */}
            <div className="flex items-center justify-between !mt-6 !mb-4 !px-3">
                <h1 className="!text-lg !font-semibold text-right">پروژه‌ها</h1>

                <div
                    className="flex justify-center items-center w-12 h-10 !bg-primary !rounded border border-gray-300 cursor-pointer"
                    onClick={handleAddProject}
                >
                    <MdAdd className="w-6 h-6 text-background"/>
                </div>
            </div>

            {projects.length === 0 ? (
                    <div className="flex items-center justify-center text-gray-500 w-full h-[60vh]">
                        <div className="text-center text-xl">هیچ پروژه ای برای نمایش وجود ندارد</div>
                    </div>
                ) :
                (
                    <div
                        className="!px-3 !mt-4 grid grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2 !pb-4 lg:grid-cols-3 xl:grid-cols-4"
                        style={{maxHeight: 'calc(100vh - 200px)'}}
                    >
                        {projects.map(project => (
                            <div
                                key={project.id}
                                onClick={() => handleOpenProject(project.id)}
                                className="w-full bg-card !rounded-lg shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
                            >
                                {/* CONTENT */}
                                <div className="flex-1 !p-3">
                                    <div className="flex flex-col gap-4 !p-4">

                                        <div className="flex gap-2 text-lg">
                                            <h2>نام پروژه: </h2>
                                            <span className="text-md">{project.name}</span>
                                        </div>

                                        <div className="flex gap-2 text-lg">
                                            <h2>کارفرما: </h2>
                                            <span>{project.client.fullname ?? "-"}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <h2>توضیحات:</h2>
                                            <span
                                                className="text-sm text-gray-600 truncate"
                                                style={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    flexGrow: 1,
                                                }}
                                            >
                                    {project.description}
                                    </span>
                                        </div>
                                        {/* PROGRESS BAR */}
                                        <div>
                                            <div className="text-xs text-gray-500 !mb-1">
                                                {project.progress}%
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full"
                                                    style={{width: `${project.progress}%`}}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}</div>)}
        </main>
    );
}
