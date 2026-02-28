import { AddClientPayload } from './client.types';

export type FieldErrors = {
    fullName?: string;
    nationalCode?: string;
    phoneNumber?: string;
    address?: string;
};

export function validateClient(data: Pick<AddClientPayload, 'fullName' | 'nationalCode' | 'phoneNumber' | 'address'>): FieldErrors {
    const errors: FieldErrors = {};

    const name = data.fullName.trim();
    const nc = data.nationalCode.trim();
    const phone = data.phoneNumber.trim();
    const addr = data.address.trim();

    const persianNameRegex = /^[\u0600-\u06FF\s]+$/;

    if (!name) {
        errors.fullName = 'نام کامل الزامی است.';
    } else if (!persianNameRegex.test(name)) {
        errors.fullName = 'نام کامل فقط می‌تواند شامل حروف فارسی و فاصله باشد.';
    }

    if (nc) {
        if (!/^\d{10}$/.test(nc)) {
            errors.nationalCode = 'کد ملی باید یک عدد ۱۰ رقمی باشد.';
        }
    }

    if (phone) {
        if (!/^09\d{9}$/.test(phone)) {
            errors.phoneNumber = 'شماره تلفن باید ۱۱ رقم و با ۰۹ شروع شود.';
        }
    }

    if (addr) {
        if (addr.length < 10) {
            errors.address = 'آدرس در صورت وارد شدن باید حداقل ۱۰ کاراکتر باشد.';
        }
    }

    return errors;
}
