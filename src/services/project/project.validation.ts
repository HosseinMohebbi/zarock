import {AddProjectPayload} from "./project.types";

export function validate(form: AddProjectPayload) {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'این فیلد الزامی است'
    if (!form.employerId) e.employerId = 'کارفرما را انتخاب کنید';
    return e
}