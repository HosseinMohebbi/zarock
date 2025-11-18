export interface AddOneTimeNotifPayload {
    "notificationDate": string,
    "isActive": boolean,
    "dayBeforeNotification": number,
    "description": string
}

export interface AddOneTimeNotifResponse {
    "createdAt": string,
    "updatedAt": string,
    "id": string,
    "type": string,
    "isActive": boolean,
    "dayBeforeNotification": number,
    "description": string,
    "notificationDate": string
}

export interface FieldErrors {
    description?: string;
    notificationDate?: string;
    dayBeforeNotification?: string;
}
