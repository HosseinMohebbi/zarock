import {http} from "@/utils/api/http";
import {RegisterPayload, RegisterResponse, LoginPayload, LoginResponse, UpdateUserPayload, UpdateUserResponse, GetUserResponse} from "./auth.types"
import {endpoints} from "@/config/endpoint.config";


// export async function registerUser(
//     payload: RegisterPayload
// ): Promise<RegisterResponse> {
//     const {data} = await http.post<RegisterResponse>("/api/User/register", payload);
//     return data;
// }

export async function registerUser(
    payload: RegisterPayload
): Promise<RegisterResponse> {
    const { data } = await http.post<RegisterResponse>(
        endpoints.auth.register,
        payload
    );
    return data;
}

export async function loginUser(
    payload: LoginPayload
): Promise<LoginResponse> {
    const { data } = await http.post<LoginResponse>(
        endpoints.auth.login,
        payload
    );
    return data;
}

export async function updateUser(
    payload: Partial<UpdateUserPayload>
): Promise<UpdateUserResponse> {
    const { data } = await http.post<UpdateUserResponse>(
        endpoints.auth.update,
        payload
    );
    return data;
}

export async function getUser(): Promise<GetUserResponse> {
    const { data } = await http.get<GetUserResponse>(
        endpoints.auth.getUser,
    );
    return data;
}

