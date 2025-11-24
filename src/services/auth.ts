import {http} from "@/utils/api/http";

export interface RegisterPayload {
    userName: string;
    fullname: string;
    nationalCode: string;
    password: string;
}

export interface RegisterResponse {
    token: string;
    expires: string;
}

export interface LoginPayload {
    userName: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    expires: string;
}

export interface UpdateUserPayload {
    fullname: string;
    nationalCode: string;
    password?: string;
    role?: string;
}

export interface UpdateUserResponse {
    username: string;
    fullname: string;
    nationalCode: string;
    roles?: string;
}

export interface GetUserResponse {
    username: string;
    fullname: string;
    role: string;
    nationalCode: string;
}

export async function registerUser(
    payload: RegisterPayload
): Promise<RegisterResponse> {
    const {data} = await http.post<RegisterResponse>("/api/User/register", payload);
    return data;
}

export async function loginUser(
    payload: LoginPayload
): Promise<LoginResponse> {
    const {data} = await http.post<LoginResponse>("/api/User/login", payload);
    return data;
}

// export async function loginUser(payload: LoginPayload): Promise<void> {
//     const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//     });
//
//     if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data.error || "Login failed");
//     }
//
//     // دیگه چیزی برنمی‌گردونیم، چون token داخل cookie ست شده
//     return;
// }


export async function updateUser(
    // payload: UpdateUserPayload
    payload: Partial<UpdateUserPayload>
): Promise<UpdateUserResponse> {
    const {data} = await http.post<UpdateUserResponse>("/api/User/update", payload);
    return data;
}

export async function getUser(): Promise<GetUserResponse> {
    const {data} = await http.get<GetUserResponse>("/api/User/user");
    return data;
}

// export async function getUser(): Promise<GetUserResponse> {
//     const res = await fetch("/api/auth/me", { method: "GET" });
//
//     if (!res.ok) throw new Error("Unauthorized");
//
//     return await res.json();
// }

