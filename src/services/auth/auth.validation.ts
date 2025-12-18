import {LoginPayload, RegisterPayload, UpdateUserPayload} from "./auth.types"

export function loginValidate (form: LoginPayload)  {
    const e: Record<string, string> = {}
    if (!form.userName.trim()) e.userName = "نام کاربری لازم است";
    if (form.password.length < 1) e.password = "رمز عبور لازم است";
    return e;
};


export function signupValidate(form: RegisterPayload) {
    const e: Record<string, string> = {};

    // username → حداقل ۳ کاراکتر + فقط حروف انگلیسی، عدد، . و _
    const usernameRegex = /^[a-zA-Z0-9._]{3,}$/;
    if (!form.userName.trim()) {
        e.userName = "نام کاربری لازم است";
    } else if (!usernameRegex.test(form.userName)) {
        e.userName = "نام کاربری باید حداقل ۳ کاراکتر و فقط شامل حروف انگلیسی، اعداد، نقطه و زیرخط باشد";
    }

    // fullname → فقط فارسی + فاصله، حداقل ۲ کاراکتر
    const fullnameRegex = /^[آ-یءٔ‌\s]{2,}$/;
    if (!form.fullname.trim()) {
        e.fullname = "نام و نام خانوادگی لازم است";
    } else if (!fullnameRegex.test(form.fullname)) {
        e.fullname = "نام و نام خانوادگی فقط باید شامل حروف فارسی و فاصله باشد (حداقل ۲ کاراکتر)";
    }

    // nationalCode → عدد ۱۰ رقمی
    const nationalCodeRegex = /^\d{10}$/;
    if (!form.nationalCode.trim()) {
        e.nationalCode = "کد ملی لازم است";
    } else if (!nationalCodeRegex.test(form.nationalCode)) {
        e.nationalCode = "کد ملی باید ۱۰ رقم باشد";
    }

    // password → حداقل ۶ کاراکتر + فقط حروف انگلیسی یا عدد
    const passwordRegex = /^[A-Za-z0-9]{6,}$/;
    if (!form.password.trim()) {
        e.password = "رمز عبور لازم است";
    } else if (!passwordRegex.test(form.password)) {
        e.password = "رمز عبور باید حداقل ۶ کاراکتر و فقط شامل حروف انگلیسی یا عدد باشد";
    }

    // confirm → باید برابر باشد
    if (form.password !== form.confirm) {
        e.confirm = "تکرار رمز عبور صحیح نیست";
    }

    return e;
}

export function updateUserValidate(form: UpdateUserPayload) {
    const e: Record<string, string> = {};
    
    // fullname → فقط فارسی + فاصله، حداقل ۲ کاراکتر
    const fullnameRegex = /^[آ-یءٔ‌\s]{2,}$/;
    if (!form.fullname.trim()) {
        e.fullname = "نام و نام خانوادگی لازم است";
    } else if (!fullnameRegex.test(form.fullname)) {
        e.fullname = "نام و نام خانوادگی فقط باید شامل حروف فارسی و فاصله باشد (حداقل ۲ کاراکتر)";
    }

    // nationalCode → عدد ۱۰ رقمی
    const nationalCodeRegex = /^\d{10}$/;
    if (!form.nationalCode.trim()) {
        e.nationalCode = "کد ملی لازم است";
    } else if (!nationalCodeRegex.test(form.nationalCode)) {
        e.nationalCode = "کد ملی باید ۱۰ رقم باشد";
    }

    // password → حداقل ۶ کاراکتر + فقط حروف انگلیسی یا عدد
    const passwordRegex = /^[A-Za-z0-9]{6,}$/;
    if (!form.password.trim()) {
        e.password = "رمز عبور لازم است";
    } else if (!passwordRegex.test(form.password)) {
        e.password = "رمز عبور باید حداقل ۶ کاراکتر و فقط شامل حروف انگلیسی یا عدد باشد";
    }

    // confirm → باید برابر باشد
    if (form.password !== form.confirm) {
        e.confirm = "تکرار رمز عبور صحیح نیست";
    }

    return e;
}
