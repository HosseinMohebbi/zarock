export interface AddMonthlyNotifPayload {
    "dayOfMonth": number,
    "isActive": boolean,
    "dayBeforeNotification": number,
    "description": string
}

export interface AddMonthlyNotifResponse {
    "createdAt": string,
    "updatedAt": string,
    "id": string,
    "type": string,
    "isActive": boolean,
    "dayBeforeNotification": number,
    "description": string,
    "dayOfMonth": number
}
