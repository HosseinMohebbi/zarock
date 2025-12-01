export interface AddBusinessPayload {
    name: string;
    description: string;
}

export interface User {
    "username": string;
    "fullname": string;
    "role": string;
    "nationalCode": string
}

export interface AddBusinessResponse {
    "createdAt": string;
    "updatedAt": string;
    "id": string;
    "name": string;
    "description": string;
    "user": User;
    "logo": {
        "createdAt": string;
        "updatedAt": string;
        "id": string;
        "fileName": string;
        "extension": string
    },
    "invitedUsers": User[]
}

export interface Business {
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    description: string;
    user: User;
    logo: {
        createdAt: string;
        updatedAt: string;
        id: string;
        fileName: string;
        extension: string;
    };
    invitedUsers: User[];
}

export interface UpdateBusinessPayload {
    name: string;
    description: string;
}

export interface UploadBusinessLogoResponse {
    id: string;
    fileName: string;
    extension: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetStaticFileResponse {
    id: string;
    fileName: string;
    url: string;
}

