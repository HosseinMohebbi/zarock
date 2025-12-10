export interface LoginPayload {
    userName: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    expires: string;
}

export interface RegisterPayload {
    userName: string;
    fullname: string;
    nationalCode: string;
    password: string;
    confirm: string;
}

export interface RegisterResponse {
    token: string;
    expires: string;
}