import {AddCheckPayload, AddCashPayload} from "./transaction.types";


export function cashValidate(form: AddCashPayload) {
    const e: Record<string, string> = {};

    if (!form.fromClient) {
        e.fromClient = "مبدا تراکنش انتخاب نشده است";
    }

    if (!form.toClient) {
        e.toClient = "مقصد تراکنش انتخاب نشده است";
    }

    if (
        form.fromClient &&
        form.toClient &&
        form.fromClient === form.toClient
    ) {
        e.toClient = 'مبدا و مقصد تراکنش نمی ‌توانند یکسان باشند';
    }

    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
        e.amount = "مبلغ معتبر نیست";
    }

    return e;
}

export function checkValidate(form: AddCheckPayload) {
    const e: Record<string, string> = {};

    if (!form.fromClient) {
        e.fromClient = "مبدا تراکنش انتخاب نشده است";
    }

    if (!form.toClient) {
        e.toClient = "مقصد تراکنش انتخاب نشده است";
    }

    if (
        form.fromClient &&
        form.toClient &&
        form.fromClient === form.toClient
    ) {
        e.toClient = 'مبدا و مقصد تراکنش نمی ‌توانند یکسان باشند';
    }

    if (!form.checkNumber) {
        e.checkNumber = "این فیلد الزامی است"
    }

    if (!form.bank) {
        e.bank = "بانک انتخاب نشده است"
    }

    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
        e.amount = "مبلغ معتبر نیست";
    }

    if (!form.receiveDate.trim())
        e.receiveDate = "تاریخ دریافت انتخاب نشده است";

    if (!form.dueDate.trim())
        e.receiveDate = "تاریخ سررسید انتخاب نشده است";

   
    if (form.receiveDate && form.dueDate) {
        const r = new Date(form.receiveDate).getTime();
        const d = new Date(form.dueDate).getTime();

        if (d < r) {
            e.dueDate = "تاریخ سررسید نمی‌تواند قبل از تاریخ دریافت باشد";
        }
    }

   
    const validStates = ["None", "Passed", "Bounced", "Expended", "Cashed"];
    if (!validStates.includes(form.state)) {
        e.state = "وضعیت چک معتبر نیست";
    }    

    return e;
}