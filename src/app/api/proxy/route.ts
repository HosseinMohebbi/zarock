import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { path, method = "GET", body, params } = await req.json();

        const token = req.cookies.get("auth_token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // ساخت URL نهایی با پارامترها
        let url = `${process.env.API_TARGET}${path}`;
        if (params && Object.keys(params).length > 0) {
            const queryString = new URLSearchParams(params as Record<string, string>).toString();
            url += `?${queryString}`;
        }

        const backendRes = await fetch(url, {
            method,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        const data = await backendRes.json();
        return NextResponse.json(data, { status: backendRes.status });
    } catch (err: any) {
        console.error("Proxy API Error:", err);
        return NextResponse.json({ error: err.message || "Proxy error" }, { status: 500 });
    }
}
