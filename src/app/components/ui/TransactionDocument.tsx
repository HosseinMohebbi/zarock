// "use client";
//
// import { useEffect, useState } from "react";
// import { getStaticFile } from "@/services/business/business.service";
// import { MdBusiness } from "react-icons/md";
//
// export default function TransactionDocument({ docId }: { docId?: string }) {
//     const [url, setUrl] = useState<string | null>(null);
//
//     useEffect(() => {
//         if (!docId) return;
//
//         (async () => {
//             try {
//                 const file = await getStaticFile(docId);
//                 setUrl(file.url);
//             } catch (err) {
//                 console.error("❌ Error loading logo:", err);
//             }
//         })();
//     }, [docId]);
//
//     if (!docId || !url)
//         return (
//             <div className="w-24 h-12 rounded-lg bg-green-100 flex items-center justify-center">
//                 <MdBusiness className="w-full h-full text-green-700" />
//             </div>
//         );
//
//     return (
//         <img
//             src={url}
//             alt="business logo"
//             className="w-24 h-24 rounded-lg object-cover"
//         />
//     );
// }

"use client";

import {useEffect, useState} from "react";
import {getStaticFile} from "@/services/business/business.service";
import {MdImage} from "react-icons/md";

export default function TransactionDocument({docId}: { docId?: string }) {
    const [url, setUrl] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!docId) return;

        (async () => {
            try {
                const file = await getStaticFile(docId);
                setUrl(file.url);
            } catch (err) {
                console.error("❌ Error loading document:", err);
            }
        })();
    }, [docId]);

    return (
        <>
            {/* دکمه نمایش سند */}
            <button
                onClick={(e) => {
                    e.stopPropagation(); // ‼️ جلوگیری از اجرای onClick کارت
                    if (url) setOpen(true);
                }}
                className="!px-3 !py-1.5  text-white !rounded shadow flex items-center gap-2 cursor-pointer"
            >
                <MdImage size={18}/>
                نمایش سند
            </button>

            {/* مدال نمایش تصویر */}
            {open && url && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                    onClick={(e) => {
                        e.stopPropagation(); // ← جلوگیری از انتشار به کارت
                        setOpen(false);
                    }}
                >
                    <img
                        src={url}
                        alt="document"
                        className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
                        onClick={(e) => e.stopPropagation()} // جلوگیری از بسته شدن هنگام کلیک روی عکس
                    />
                </div>
            )}
        </>
    );
}

