"use client";
import {useEffect, useState} from "react";
import {getStaticFile} from "@/services/business/business.service";
import {MdImage} from "react-icons/md";

export default function TransactionDocument({docId, transactionTitle}: { docId?: string, transactionTitle?: string }) {
    const [url, setUrl] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!docId) return;

        (async () => {
            try {
                const file = await getStaticFile(docId);
                setUrl(file.url);
            } catch (err) {

            }
        })();
    }, [docId]);

    return (
        <>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    if (url) setOpen(true);
                }}
                className="!px-3 !py-1.5  text-white !rounded shadow flex items-center gap-2 cursor-pointer"
            >
                <MdImage size={18}/>
                {transactionTitle}
            </button>

            {open && url && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpen(false);
                    }}
                >
                    <img
                        src={url}
                        alt="document"
                        className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
}

