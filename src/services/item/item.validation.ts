import {AddItemPayload} from "@/services/item/item.types";

export function validate(form: AddItemPayload) {
    const e: Record<string, string> = {}
    if (!form.group.trim()) e.group = 'این فیلد الزامی است'
    if (!form.unit.trim()) e.unit = 'این فیلد الزامی است'
    const price = Number(form.defaultUnitPrice)
    if (isNaN(price) || price < 0) e.defaultUnitPrice = 'قیمت معتبر نیست'
    return e
}