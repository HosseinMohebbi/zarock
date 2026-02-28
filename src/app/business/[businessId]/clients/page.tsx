'use client';
import {useEffect, useState} from "react";
import Input from "@/app/components/ui/Input";
import {useParams, useRouter} from "next/navigation";
import {MdAdd} from "react-icons/md";
import {Client} from "@/services/client/client.types"

// Redux
import {useDispatch, useSelector} from "react-redux";
import {
    fetchClients,
    selectClients,
    selectClientsError,
} from "@/app/store/clientsSlice";

// Loader
import Loader from "@/app/components/ui/Loader";

export default function ClientsPage() {

    const dispatch = useDispatch<any>();
    const clients = useSelector(selectClients);
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
                <div className="overflow-x-auto !px-3 !py-3" style={{maxHeight: 'calc(100vh - 250px)'}}>
                    <table className="w-full table-fixed !border-collapse !border !border-gray-300 bg-white shadow-md !rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="!border !border-gray-300 !px-6 !py-3 text-right font-semibold text-gray-700 w-4/12">نام</th>
                                <th className="!border !border-gray-300 !px-6 !py-3 text-right font-semibold text-gray-700 w-2/12">شماره تلفن</th>
                                <th className="!border !border-gray-300 !px-6 !py-3 text-right font-semibold text-gray-700 w-6/12">آدرس</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client: Client) => (
                                <tr
                                    key={client.id}
                                    className="!cursor-pointer hover:bg-gray-50 transition-colors !duration-200 !border-b !border-gray-200"
                                    onClick={() => handelEditClient(client.id)}
                                >
                                    <td className="!border !border-gray-300 !px-6 !py-4 text-gray-800">
                                        <div className="flex justify-between items-center">
                                            <span>{client.fullname}</span>
                                            <span className="bg-green-500 text-white !px-2 !py-1 rounded text-sm">
                                                {client.isJuridicalPerson ? 'حقوقی' : 'حقیقی'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="!border !border-gray-300 !px-6 !py-4 text-right text-gray-800">
                                        {client.phoneNumber || '-'}
                                    </td>
                                    <td className="!border !border-gray-300 !px-6 !py-4 text-right text-gray-800 truncate">
                                        {client.address}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
