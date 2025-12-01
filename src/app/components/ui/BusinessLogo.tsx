"use client";

import { useEffect, useState } from "react";
import { getStaticFile } from "@/services/business/business.service";
import { MdBusiness } from "react-icons/md";

export default function BusinessLogo({ logoId }: { logoId?: string }) {
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!logoId) return;

        (async () => {
            try {
                const file = await getStaticFile(logoId);
                setUrl(file.url);
            } catch (err) {
                console.error("❌ Error loading logo:", err);
            }
        })();
    }, [logoId]);

    if (!logoId || !url)
        return (
            <div className="w-24 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <MdBusiness className="w-full h-full text-green-700" />
            </div>
        );

    return (
        <img
            src={url}
            alt="business logo"
            className="w-24 h-24 rounded-lg object-cover"
        />
    );
}
