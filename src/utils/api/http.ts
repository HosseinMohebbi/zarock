import axios, { AxiosInstance } from "axios";

// export const http: AxiosInstance = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
//     headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//     },
//     timeout: 15_000,
// });

export const http = axios.create({
    baseURL: "", // همون اوریجین فرانت
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    timeout: 15_000,
});

// اختیاری: افزودن توکن از localStorage در سمت کلاینت
http.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
