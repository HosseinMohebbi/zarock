import axios from "axios";

export const http = axios.create({
    baseURL: "", 
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    timeout: 15_000,
});

http.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


let isRedirecting = false;

http.interceptors.response.use(
    (response) => response,

    (error) => {
        if (typeof window !== "undefined") {
            const status = error.response?.status;

            if (status === 401) {
                if (!isRedirecting) {
                    isRedirecting = true;
                    
                    localStorage.removeItem("auth_token");
                    
                    window.location.href = "/login";
                }
            }
        }

        return Promise.reject(error);
    }
);


