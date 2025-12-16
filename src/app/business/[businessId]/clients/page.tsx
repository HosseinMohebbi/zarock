'use client';
import {useEffect, useState} from "react";
import Card from "@/app/components/ui/Card";
import Input from "@/app/components/ui/Input";
import {useParams, useRouter} from "next/navigation";
import {MdAdd} from "react-icons/md";
import {Client} from "@/services/client/client.types"

// Redux
import {useDispatch, useSelector} from "react-redux";
import {
    fetchClients,
    selectClients,
    selectClientsLoading,
    selectClientsError,
} from "@/app/store/clientsSlice";

// Loader
import Loader from "@/app/components/ui/Loader";

export default function ClientsPage() {

    const dispatch = useDispatch<any>();
    const clients = useSelector(selectClients);
    const loading = useSelector(selectClientsLoading);
    const error = useSelector(selectClientsError);
    const [isFetching, setIsFetching] = useState(true);

    const [searchPattern, setSearchPattern] = useState('');
    const [tags] = useState<string[]>([]);

    const params = useParams() as { businessId?: string };
    const businessId = params.businessId ?? '';
    const router = useRouter();

    const [page] = useState(1);
    const [pageSize] = useState(50);

    useEffect(() => {
        if (businessId) {
            setIsFetching(false);
            dispatch(
                fetchClients({
                    businessId,
                    pattern: searchPattern,
                    tags,
                    page,
                    pageSize
                })
            );
        }
    }, [businessId, searchPattern, tags, page, pageSize]);

    const handleAddClientButton = () => {
        router.push(`/business/${businessId}/clients/add-client`);
    };

    const handelEditClient = (clientId: string) => {
        router.push(`/business/${businessId}/clients/edit-client/${clientId}`);
    };
    
    if (isFetching) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader/> {/* TailChase */}
            </div>
        );
    }
    
    return (
        <div className="!p-4 !pt-24 flex flex-col gap-2">
            {/* HEADER */}
            <div className="flex items-center justify-between gap-4 !px-3">
                <h1 className="!text-lg !font-semibold text-right">اشخاص</h1>

                <div
                    className="flex justify-center items-center w-12 h-10 !bg-primary !rounded border border-gray-300 cursor-pointer"
                    onClick={handleAddClientButton}
                >
                    <MdAdd className="w-6 h-6 text-background"/>
                </div>
            </div>

            {/* SEARCH */}
            <div className="!mb-4 !px-3 flex gap-4">
                <Input
                    name="searchPattern"
                    type="text"
                    placeholder="جستجو بر اساس نام یا گروه"
                    value={searchPattern}
                    onChange={(e) => setSearchPattern(e.target.value)}
                />
            </div>

            {/* ERROR */}
            {error && (
                <div className="text-center text-red-500 !py-4">{error}</div>
            )}

            {/* CLIENT LIST OR EMPTY MESSAGE */}
            {clients.length === 0 ? (
                <div className="flex items-center justify-center text-gray-500 w-full h-[60vh]">
                    <div className="text-center text-xl">هیچ شخصی برای نمایش وجود ندارد</div>
                </div>
            ) : (
                <div
                    className="overflow-y-auto !px-3 !py-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    style={{maxHeight: 'calc(100vh - 250px)'}}
                >
                    {clients.map((client: Client) => (
                        <Card
                            key={client.id}
                            customStyle="w-full max-w-xl border !rounded-md !p-4 bg-card cursor-pointer"
                            onClick={() => handelEditClient(client.id)}
                        >
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <h2 className="!text-lg">نام:</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="text-base">{client.fullname}</span>
                                        <span>{client.isJuridicalPerson ? "(حقوقی)" : "(حقیقی)"}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <h2 className="!text-lg">آدرس:</h2>
                                    <span
                                        className="text-sm text-gray-600 truncate"
                                        style={{
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            flexGrow: 1,
                                        }}
                                    >
                                    {client.address}
                                </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <h2 className="!text-lg">حساب:</h2>
                                    <span className="text-lg text-gray-600">
                                    {(client.credits ?? 0).toLocaleString()} تومان
                                </span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}


