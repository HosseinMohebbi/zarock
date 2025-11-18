import {Client} from "@/services/client/client.types"
export interface AddCheckNotifResponse {
    "createdAt": string,
    "updatedAt": string,
    "id": string,
    "type": string,
    "isActive": boolean,
    "dayBeforeNotification": number,
    "description": string,
    "check": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "toClient": {
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "fullname": "string",
            "nationalCode": "string",
            "address": "string",
            "credits": 0,
            "isJuridicalPerson": true,
            "isOwnerClient": true,
            "constantDescriptionInvoice": "string"
        },
        "fromClient": Client,
        "amount": number,
        "document": {
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "fileName": "string",
            "extension": "string"
        },
        "tags": [
            "string"
        ],
        "transactionType": "Check",
        "flowType": "None",
        "hasNotification": boolean,
        "notificationId": string,
        "checkNumber": string,
        "bank": "string",
        "receiveDate": string,
        "dueDate": string,
        "state": "None"
    }
}
