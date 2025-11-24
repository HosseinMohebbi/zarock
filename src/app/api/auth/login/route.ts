export async function POST(req: Request) {
    try {
        const body = await req.json();

        const backendRes = await fetch(`${process.env.API_TARGET}/api/User/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await backendRes.json();

        if (!backendRes.ok || !data?.token) {
            return Response.json(
                { error: data?.error || "Login failed" },
                { status: backendRes.status || 500 }
            );
        }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                "Set-Cookie": `auth_token=${data.token}; Path=/; HttpOnly; SameSite=Lax;`,
                "Content-Type": "application/json",
            },
        });
    } catch (e) {
        console.error("LOGIN API ERROR:", e);
        return Response.json(
            { error: "Server error", detail: (e as Error).message },
            { status: 500 }
        );
    }
}
