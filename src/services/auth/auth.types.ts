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