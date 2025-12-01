// 'use client'
//
// import React, {useState, useEffect} from 'react'
// import {useParams, useRouter} from 'next/navigation'
// import Input from '@/app/components/ui/Input'
// import Button from '@/app/components/ui/Button'
// import ConfirmModal from '@/app/components/ui/ConfirmModal'
// import {MdDelete} from "react-icons/md";
// import {itemType, getItemResponse} from "@/services/item/item.types";
// import {getAllItems, updateItem, deleteItem} from '@/services/item/item.service'
// import {toast} from "react-toastify";
//
// type FormState = {
//     name: string
//     group: string
//     unit: string
//     defaultUnitPrice: string
//     type: itemType
//     tags: string[]
//     tagInput: string
//     description: string
// }
//
// export default function EditItemFormPage() {
//     const params = useParams() as { businessId?: string; itemId?: string }
//     const router = useRouter()
//     const businessId = params.businessId ?? ''
//     const itemId = params.itemId ?? ''
//
//     const [form, setForm] = useState<FormState>({
//         name: '',
//         group: '',
//         unit: '',
//         defaultUnitPrice: '',
//         type: 'Merchandise',
//         tags: [],
//         tagInput: '',
//         description: '',
//     })
//
//     const [errors, setErrors] = useState<Record<string, string>>({})
//     const [loading, setLoading] = useState(false)
//     const [message, setMessage] = useState<string | null>(null)
//     const [showConfirm, setShowConfirm] = useState(false)
//
//     useEffect(() => {
//         if (!businessId || !itemId) return
//
//         async function loadItem() {
//             try {
//                 const items = await getAllItems({page: 1, pageSize: 50}, businessId)
//                 const item = items.find(i => i.id === itemId)
//                 if (!item) {
//                     setMessage('آیتم یافت نشد')
//                     return
//                 }
//
//                 setForm({
//                     name: item.name,
//                     group: item.group,
//                     unit: item.unit,
//                     defaultUnitPrice: item.defaultUnitPrice.toString(),
//                     type: item.itemType,
//                     tags: [], // اگر API شما تگ‌ها دارد، اینجا مقدار بده
//                     tagInput: '',
//                     description: item.description,
//                 })
//             } catch (err: any) {
//                 console.error(err)
//                 toast.error('خطا در بارگذاری آیتم')
//             }
//         }
//
//         loadItem()
//     }, [businessId, itemId])
//
//     function validate() {
//         const e: Record<string, string> = {}
//         if (!form.group.trim()) e.group = 'این فیلد الزامی است'
//         if (!form.unit.trim()) e.unit = 'این فیلد الزامی است'
//         const price = Number(form.defaultUnitPrice)
//         if (isNaN(price) || price < 0) e.defaultUnitPrice = 'قیمت معتبر نیست'
//         return e
//     }
//
//     async function handleSubmit(ev?: React.FormEvent) {
//         ev?.preventDefault()
//         setMessage(null)
//         const v = validate()
//         if (Object.keys(v).length) {
//             setErrors(v)
//             return
//         }
//         if (!businessId || !itemId) {
//             setMessage('شناسه کسب‌وکار یا آیتم پیدا نشد')
//             return
//         }
//
//         setLoading(true)
//         setErrors({})
//         try {
//             const payload = {
//                 name: form.name.trim(),
//                 group: form.group.trim(),
//                 type: form.type,
//                 tags: form.tags,
//                 defaultUnitPrice: Number(form.defaultUnitPrice) || 0,
//                 unit: form.unit.trim(),
//                 description: form.description.trim(),
//             }
//             await updateItem(businessId, itemId, payload)
//             toast.success("آیتم با موفقیت ویرایش شد");
//             router.push(`/business/${businessId}/items`)
//         } catch (err: any) {
//             console.error(err)
//             toast.error('خطا در ویرایش آیتم')
//         } finally {
//             setLoading(false)
//         }
//     }
//
//     function handleAddTagFromInput() {
//         const val = form.tagInput.trim()
//         if (!val) return
//         const newTags = val.split(',').map(t => t.trim()).filter(Boolean)
//         setForm(f => ({...f, tags: Array.from(new Set([...f.tags, ...newTags])), tagInput: ''}))
//     }
//
//     function handleRemoveTag(tag: string) {
//         setForm(f => ({...f, tags: f.tags.filter(t => t !== tag)}))
//     }
//
//     function handleCancelForm() {
//         router.push(`/business/${businessId}/items`)
//     }
//
//     function handleDelete() {
//         setShowConfirm(true)
//     }
//
//     async function confirmDelete() {
//         setShowConfirm(false)
//         await deleteItem(businessId, itemId)
//         router.push(`/business/${businessId}/items`)
//         toast.success("کالا/خدمت با موفقیت حذف شد")
//     }
//
//     return (
//         <div className="w-full flex justify-center !px-4">
//             <div className="w-full max-w-lg mx-auto !p-6 bg-background text-foreground rounded-lg shadow">
//                 <div className="relative w-full flex items-start">
//                     <div onClick={handleDelete} className="absolute right-0 text-danger cursor-pointer">
//                         <MdDelete className='w-6 h-6'/>
//                     </div>
//                     <h2 className="!mx-auto text-xl font-semibold !mb-4 text-center">ویرایش کالا / خدمت</h2>
//                 </div>
//                 {message && (
//                     <div className="!mb-4 text-sm text-center">
//             <span className="inline-block !px-3 !py-1 bg-green-100 text-green-800 rounded">
//               {message}
//             </span>
//                     </div>
//                 )}
//
//                 <form onSubmit={handleSubmit} className="flex flex-col gap-5">
//                     <Input
//                         label="گروه"
//                         name="group"
//                         value={form.group}
//                         onChange={e => setForm(f => ({...f, group: e.target.value}))}
//                         error={errors.group}
//                     />
//                     <Input
//                         label="زیرگروه"
//                         name="name"
//                         value={form.name}
//                         onChange={e => setForm(f => ({...f, name: e.target.value}))}
//                     />
//                     <Input
//                         label="واحد"
//                         name="unit"
//                         value={form.unit}
//                         onChange={e => setForm(f => ({...f, unit: e.target.value}))}
//                         error={errors.unit}
//                     />
//                     <Input
//                         label="قیمت واحد پیش‌فرض"
//                         name="defaultUnitPrice"
//                         type="number"
//                         value={form.defaultUnitPrice}
//                         onChange={e => setForm(f => ({...f, defaultUnitPrice: e.target.value}))}
//                         error={errors.defaultUnitPrice}
//                     />
//
//                     <div className="flex flex-col gap-2">
//                         <label className="text-lg font-medium">نوع</label>
//                         <div className="flex items-center gap-6">
//                             <label className="flex items-center gap-2 text-lg">
//                                 <input
//                                     type="radio"
//                                     name="type"
//                                     value="Merchandise"
//                                     checked={form.type === 'Merchandise'}
//                                     onChange={() => setForm(f => ({...f, type: 'Merchandise'}))}
//                                     className="accent-primary"
//                                 />
//                                 <span>کالا</span>
//                             </label>
//                             <label className="flex items-center gap-2">
//                                 <input
//                                     type="radio"
//                                     name="type"
//                                     value="Service"
//                                     checked={form.type === 'Service'}
//                                     onChange={() => setForm(f => ({...f, type: 'Service'}))}
//                                     className="accent-primary"
//                                 />
//                                 <span>خدمت</span>
//                             </label>
//                         </div>
//                     </div>
//
//                     <div className="flex flex-col gap-2">
//                         <label className="text-lg font-medium">تگ‌ها</label>
//                         <div className="flex gap-2 items-center">
//                             <Input
//                                 value={form.tagInput}
//                                 onChange={e => setForm(f => ({...f, tagInput: e.target.value}))}
//                                 onKeyDown={e => {
//                                     if (e.key === 'Enter') {
//                                         e.preventDefault()
//                                         handleAddTagFromInput()
//                                     }
//                                 }}
//                                 onBlur={handleAddTagFromInput}
//                             />
//                             <button
//                                 type="button"
//                                 onClick={handleAddTagFromInput}
//                                 className="!px-3 !py-2 bg-gray-100 rounded"
//                             >
//                                 افزودن
//                             </button>
//                         </div>
//                         <div className="flex flex-wrap gap-2 !mt-2">
//                             {form.tags.map(t => (
//                                 <span key={t}
//                                       className="flex items-center gap-2 bg-muted text-foreground !px-2 !py-1 !rounded text-sm">
//                   {t}
//                                     <button type="button" onClick={() => handleRemoveTag(t)} className="text-red-500">
//                     ×
//                   </button>
//                 </span>
//                             ))}
//                         </div>
//                     </div>
//
//                     <Input
//                         label="توضیحات"
//                         name="description"
//                         type="text"
//                         value={form.description}
//                         onChange={e => setForm(f => ({...f, description: e.target.value}))}
//                     />
//
//                     <div className="flex justify-end items-center gap-3 mt-3">
//                         <Button label="لغو" type="button" onClick={handleCancelForm}/>
//                         <Button label="ذخیره" type="submit"/>
//                     </div>
//                 </form>
//             </div>
//             <ConfirmModal
//                 title="حذف کالا/خدمت"
//                 isOpen={showConfirm}
//                 message="آیا مطمئن هستید که می‌خواهید این کالا/خدمت را حذف کنید؟"
//                 onConfirm={confirmDelete}
//                 onCancel={() => setShowConfirm(false)}
//             />
//         </div>
//     )
// }

'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import {selectItems, updateItemThunk, clearItems, deleteItemThunk} from '@/app/store/itemsSlice';
import { itemType, getItemResponse } from "@/services/item/item.types";

type FormState = {
    name: string;
    group: string;
    unit: string;
    defaultUnitPrice: string;
    type: itemType;
    tags: string[];
    tagInput: string;
    description: string;
}

export default function EditItemFormPage() {
    const params = useParams() as { businessId?: string; itemId?: string };
    const router = useRouter();
    const businessId = params.businessId ?? '';
    const itemId = params.itemId ?? '';
    const dispatch = useDispatch();

    const items = useSelector(selectItems);
    const item = items.find(i => i.id === itemId);

    const [form, setForm] = useState<FormState>({
        name: '',
        group: '',
        unit: '',
        defaultUnitPrice: '',
        type: 'Merchandise',
        tags: [],
        tagInput: '',
        description: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (!item) return;
        setForm({
            name: item.name,
            group: item.group,
            unit: item.unit,
            defaultUnitPrice: item.defaultUnitPrice.toString(),
            type: item.itemType,
            tags: [],
            tagInput: '',
            description: item.description,
        });
    }, [item]);

    function validate() {
        const e: Record<string, string> = {};
        if (!form.group.trim()) e.group = 'این فیلد الزامی است';
        if (!form.unit.trim()) e.unit = 'این فیلد الزامی است';
        const price = Number(form.defaultUnitPrice);
        if (isNaN(price) || price < 0) e.defaultUnitPrice = 'قیمت معتبر نیست';
        return e;
    }

    async function handleSubmit(ev?: React.FormEvent) {
        ev?.preventDefault();
        const v = validate();
        if (Object.keys(v).length) {
            setErrors(v);
            return;
        }
        if (!businessId || !itemId) return;

        setLoading(true);
        setErrors({});
        try {
            const payload = {
                name: form.name.trim(),
                group: form.group.trim(),
                type: form.type,
                tags: form.tags,
                defaultUnitPrice: Number(form.defaultUnitPrice) || 0,
                unit: form.unit.trim(),
                description: form.description.trim(),
            };
            await dispatch(updateItemThunk({ businessId, itemId, payload })).unwrap();
            dispatch(clearItems()); // پاک کردن لیست برای refetch در صفحه items
            toast.success("آیتم با موفقیت ویرایش شد");
            router.push(`/business/${businessId}/items`);
        } catch (err: any) {
            toast.error(err || 'خطا در ویرایش آیتم');
        } finally {
            setLoading(false);
        }
    }

    // function handleAddTagFromInput() {
    //     const val = form.tagInput.trim();
    //     if (!val) return;
    //     const newTags = val.split(',').map(t => t.trim()).filter(Boolean);
    //     setForm(f => ({ ...f, tags: Array.from(new Set([...f.tags, ...newTags])), tagInput: '' }));
    // }
    //
    // function handleRemoveTag(tag: string) {
    //     setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
    // }

    function handleCancelForm() {
        router.push(`/business/${businessId}/items`);
    }

    function handleDelete() {
        setShowConfirm(true);
    }

    async function confirmDelete() {
        setShowConfirm(false);
        // فرض کردیم deleteItemThunk ساخته نشده، می‌توان مستقیماً API صدا زد
        await dispatch(deleteItemThunk({ businessId, itemId })).unwrap();
        dispatch(clearItems());
        router.push(`/business/${businessId}/items`);
        toast.success("کالا/خدمت با موفقیت حذف شد");
    }

    return (
        <div className="w-full flex justify-center !px-4 !pt-24">
            <div className="w-full max-w-lg mx-auto !p-6 bg-background text-foreground rounded-lg shadow">
                <div className="relative w-full flex items-start">
                    <div onClick={handleDelete} className="absolute right-0 text-danger cursor-pointer">
                        <MdDelete className='w-6 h-6' />
                    </div>
                    <h2 className="!mx-auto text-xl font-semibold !mb-4 text-center">ویرایش کالا / خدمت</h2>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* فیلدها مثل قبل */}
                    <Input label="گروه" name="group" value={form.group} onChange={e => setForm(f => ({ ...f, group: e.target.value }))} error={errors.group} />
                    <Input label="زیرگروه" name="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    <Input label="واحد" name="unit" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} error={errors.unit} />
                    <Input label="قیمت واحد" name="defaultUnitPrice" type="number" value={form.defaultUnitPrice} onChange={e => setForm(f => ({ ...f, defaultUnitPrice: e.target.value }))} error={errors.defaultUnitPrice} />

                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium">نوع</label>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 text-lg">
                                <input type="radio" name="type" value="Merchandise" checked={form.type === 'Merchandise'} onChange={() => setForm(f => ({ ...f, type: 'Merchandise' }))} className="accent-primary" />
                                <span>کالا</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" name="type" value="Service" checked={form.type === 'Service'} onChange={() => setForm(f => ({ ...f, type: 'Service' }))} className="accent-primary" />
                                <span>خدمت</span>
                            </label>
                        </div>
                    </div>

                    <Input label="توضیحات" name="description" type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />

                    <div className="flex justify-end items-center gap-3 mt-3">
                        <Button label="لغو" type="button" onClick={handleCancelForm} />
                        <Button label="ذخیره" type="submit" />
                    </div>
                </form>
            </div>
            <ConfirmModal title="حذف کالا/خدمت" isOpen={showConfirm} message="آیا مطمئن هستید که می‌خواهید این کالا/خدمت را حذف کنید؟" onConfirm={confirmDelete} onCancel={() => setShowConfirm(false)} />
        </div>
    );
}



