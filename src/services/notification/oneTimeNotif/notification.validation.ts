import {FieldErrors} from "./notification.types";

export function validate(
    description: string,
    notificationDate: string,
    dayBeforeNotification: string
): FieldErrors {

    const errors: FieldErrors = {};

    if (!description.trim())
        errors.description = "توضیحات الزامی است";

    if (!notificationDate.trim())
        errors.notificationDate = "تاریخ الزامی است";

    if (!dayBeforeNotification.trim() || Number(dayBeforeNotification) < 0)
        errors.dayBeforeNotification = "تعداد روز را صحیح وارد کنید";

    return errors;
}