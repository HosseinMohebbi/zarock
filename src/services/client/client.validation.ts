import {AddClientPayload} from "./client.types"

export type FieldErrors = {
    fullName?: string
    nationalCode?: string
    address?: string
}

export function validateClient({fullName, nationalCode, address}): FieldErrors {
    const errors: FieldErrors = {}

    const name = fullName.trim()
    const nc = nationalCode.trim()
    const addr = address.trim()

    // فقط حروف فارسی و فاصله
    const persianNameRegex = /^[\u0600-\u06FF\s]+$/

    if (!name) {
        errors.fullName = 'نام کامل الزامی است.'
    } else if (!persianNameRegex.test(name)) {
        errors.fullName = 'نام کامل فقط می‌تواند شامل حروف فارسی و فاصله باشد.'
    }

    if (nc) {
        if (!/^\d{10}$/.test(nc)) {
            errors.nationalCode = 'کد ملی باید یک عدد ۱۰ رقمی باشد.'
        }
    }

    if (addr) {
        if (addr.length < 10) {
            errors.address = 'آدرس در صورت وارد شدن باید حداقل ۱۰ کاراکتر باشد.'
        }
    }

    return errors
}
