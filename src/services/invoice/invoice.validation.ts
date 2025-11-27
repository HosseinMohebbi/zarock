import {AddInvoicePayload} from "@/services/invoice/invoice.types";

export function validate(form: AddInvoicePayload) {
    const e: Record<string, string> = {};
    if (!form.fromClient) e.fromClient = 'فروشنده را انتخاب کنید';
    if (!form.toClient) e.toClient = 'خریدار را انتخاب کنید';
    return e;
}