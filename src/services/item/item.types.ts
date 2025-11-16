export type itemType = "Service" | "Merchandise";

export interface AddItemPayload {
    name: string;
    group: string;
    type: itemType;
    tags: string[];
    defaultUnitPrice: number;
    unit: string;
    description: string;
}

export interface AddItemResponse {
    id: string
    name: string;
    group: string;
    defaultUnitPrice: number;
    unit: string;
    itemType: itemType;
    description: string;
}

export interface getItemResponse {
    id: String;
    name: string;
    group: string;
    defaultUnitPrice: number;
    unit: string;
    itemType: itemType;
    description: string;
}