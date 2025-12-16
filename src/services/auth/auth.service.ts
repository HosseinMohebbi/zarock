import {http} from "@/utils/api/http";
import {RegisterPayload, RegisterResponse, LoginPayload, LoginResponse, UpdateUserPayload, UpdateUserResponse, GetUserResponse} from "./auth.types"

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

export async function updateUser(
    payload: Partial<UpdateUserPayload>
): Promise<UpdateUserResponse> {
    const {data} = await http.post<UpdateUserResponse>("/api/User/update", payload);
    return data;
}

export async function getUser(): Promise<GetUserResponse> {
    const {data} = await http.get<GetUserResponse>("/api/User/user");
    return data;
}

