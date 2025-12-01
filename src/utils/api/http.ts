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
    // withCredentials: true,
});

// اختیاری: افزودن توکن از localStorage در سمت کلاینت
http.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


//  مدیریت خطای 401 (توکن منقضی شده)
let isRedirecting = false; // جلوگیری از چندبار ریدایرکت

http.interceptors.response.use(
    (response) => response,

    (error) => {
        if (typeof window !== "undefined") {
            const status = error.response?.status;

            if (status === 401) {
                console.warn("🔒 Token expired → redirecting to login");

                if (!isRedirecting) {
                    isRedirecting = true;

                    // پاک کردن توکن
                    localStorage.removeItem("auth_token");

                    // ریدایرکت به لاگین
                    window.location.href = "/login";
                }
            }
        }

        return Promise.reject(error);
    }
);


