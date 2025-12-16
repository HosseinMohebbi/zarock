import {AddInvoicePayload} from "@/services/invoice/invoice.types";

export function validate(form: AddInvoicePayload) {
    const e: Record<string, string> = {};
    if (!form.fromClient) e.fromClient = 'فروشنده را انتخاب کنید';
    if (!form.toClient) e.toClient = 'خریدار را انتخاب کنید';
    if (form.hint) {
        if (form.hint.length < 2) {
            e.hint = 'توضیح کوتاه در صورت وارد شدن باید حداقل 2 کاراکتر باشد.';
        }
    }

    if (form.invoiceItems && form.invoiceItems.length > 0) {
        form.invoiceItems.forEach((item, index) => {

            if (!item.quantity || item.quantity.trim() === "") {
                e[`item_${index}_quantity`] = `مقدار آیتم شماره ${index + 1} را وارد کنید`;
            }

            if (!item.quantityMetric || item.quantityMetric.trim() === "") {
                e[`item_${index}_metric`] = `واحد آیتم شماره ${index + 1} را وارد کنید`;
            }

            if (!item.price || item.price.trim() === "") {
                e[`item_${index}_price`] = `قیمت آیتم شماره ${index + 1} را وارد کنید`;
            }
        });
    }

    return e;
}