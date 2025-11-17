'use client';
import React, { useEffect, useRef, useState } from 'react';
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
import { cn } from '@/utils/cn';

export type SelectOption = {
    value: string;
    label: string;
    icon?: string | React.ReactNode;
};

interface SelectProps {
    options: SelectOption[];
    value?: string | null;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    className?: string;
    disabled?: boolean; // ← اضافه شد
}

export default function Select({
                                   options,
                                   value = null,
                                   onChange,
                                   placeholder = 'انتخاب کنید',
                                   label,
                                   className,
                                   disabled = false, // ← پیش‌فرض
                               }: SelectProps) {
    const [open, setOpen] = useState(false);
    const [highlighted, setHighlighted] = useState<number>(-1);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const listRef = useRef<HTMLUListElement | null>(null);

    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!rootRef.current) return;
            if (!rootRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    useEffect(() => {
        if (open && highlighted === -1) {
            const initial = options.findIndex(o => o.value === value);
            setHighlighted(initial >= 0 ? initial : 0);
        }
    }, [open, highlighted, options, value]);

    useEffect(() => {
        if (open && listRef.current && highlighted >= 0) {
            const item = listRef.current.children[highlighted] as HTMLElement | undefined;
            item?.scrollIntoView({ block: 'nearest' });
        }
    }, [highlighted, open]);

    const handleToggle = () => {
        if (!disabled) setOpen(s => !s);
    };

    const handleSelect = (idx: number) => {
        if (disabled) return;
        const opt = options[idx];
        if (!opt) return;
        onChange(opt.value);
        setOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!open) setOpen(true);
            setHighlighted(h => (h + 1) % options.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!open) setOpen(true);
            setHighlighted(h => (h - 1 + options.length) % options.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (open && highlighted >= 0) handleSelect(highlighted);
            else setOpen(true);
        } else if (e.key === 'Escape') {
            setOpen(false);
        }
    };

    const selected = options.find(o => o.value === value) ?? null;

    return (
        <div ref={rootRef} className={cn('relative w-full text-right', className)}>
            {label && <label className="block text-sm !mb-1 text-foreground">{label}</label>}

            <div
                tabIndex={disabled ? -1 : 0}
                role="combobox"
                aria-controls="select-listbox"
                aria-expanded={open}
                aria-haspopup="listbox"
                aria-disabled={disabled}
                aria-label={label ?? 'select'}
                onKeyDown={disabled ? undefined : handleKeyDown}
                onClick={disabled ? undefined : handleToggle}
                className={cn(
                    "flex items-center justify-between gap-2 !px-3 !py-2 border !rounded-md shadow-sm bg-white dark:bg-card dark:text-card-foreground border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer",
                    disabled && "bg-gray-100 text-gray-400 cursor-not-allowed opacity-70"
                )}
            >
                <div className="flex items-center gap-3">
                    {selected?.icon ? (
                        typeof selected.icon === 'string' ? (
                            <img src={selected.icon} alt={selected.label} className="w-6 h-6 object-contain rounded-sm" />
                        ) : (
                            <span className="w-6 h-6 flex items-center justify-center">{selected.icon}</span>
                        )
                    ) : null}

                    <span className={cn('text-sm', !selected ? 'text-zinc-400' : '')}>
                        {selected ? selected.label : placeholder}
                    </span>
                </div>

                <div className="flex items-center">
                    {open ? <MdArrowDropUp className="w-6 h-6" /> : <MdArrowDropDown className="w-6 h-6" />}
                </div>
            </div>

            {/* dropdown */}
            {!disabled && open && (
                <ul
                    id="select-listbox"
                    role="listbox"
                    ref={listRef}
                    className="absolute z-50 !mt-2 w-full max-h-56 overflow-auto rounded-md border bg-white dark:bg-card dark:text-card-foreground border-gray-200 dark:border-zinc-700 shadow-lg !py-1"
                >
                    {options.map((opt, i) => {
                        const isSelected = value === opt.value;
                        const isHighlighted = highlighted === i;
                        return (
                            <li
                                key={opt.value}
                                role="option"
                                aria-selected={isSelected}
                                onMouseEnter={() => setHighlighted(i)}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelect(i);
                                }}
                                className={cn(
                                    'flex items-center justify-between gap-3 !px-3 !py-2 cursor-pointer text-sm',
                                    isHighlighted ? 'bg-indigo-50 dark:bg-zinc-700' : 'hover:bg-gray-50 dark:hover:bg-zinc-800'
                                )}
                                dir="rtl"
                            >
                                <div className="flex items-center gap-3">
                                    {opt.icon ? (
                                        typeof opt.icon === 'string' ? (
                                            <img src={opt.icon} alt={opt.label} className="w-6 h-6 object-contain rounded-sm" />
                                        ) : (
                                            <span className="w-6 h-6 flex items-center justify-center">{opt.icon}</span>
                                        )
                                    ) : null}
                                    <span className={cn(isSelected ? 'font-medium' : '')}>{opt.label}</span>
                                </div>

                                {isSelected && <span className="text-indigo-600 dark:text-indigo-300">✔</span>}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}


// // components/ui/Select.tsx
// 'use client';
// import React, { useEffect, useRef, useState } from 'react';
// import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
// import { cn } from '@/utils/cn';
//
// export type SelectOption = {
//     value: string;
//     label: string;
//     /** optional icon url or ReactNode — if string treated as <img /> */
//     icon?: string | React.ReactNode;
// };
//
// interface SelectProps {
//     options: SelectOption[];
//     value?: string | null;
//     onChange: (value: string) => void;
//     placeholder?: string;
//     label?: string;
//     className?: string;
//     disabled?: boolean;
// }
//
// /**
//  * RTL-friendly custom select with keyboard support and icons.
//  */
// export default function Select({
//                                    options,
//                                    value = null,
//                                    onChange,
//                                    placeholder = 'انتخاب کنید',
//                                    label,
//                                    className,
//                                }: SelectProps) {
//     const [open, setOpen] = useState(false);
//     const [highlighted, setHighlighted] = useState<number>(-1);
//     const rootRef = useRef<HTMLDivElement | null>(null);
//     const listRef = useRef<HTMLUListElement | null>(null);
//
//     useEffect(() => {
//         function onDocClick(e: MouseEvent) {
//             if (!rootRef.current) return;
//             if (!rootRef.current.contains(e.target as Node)) {
//                 setOpen(false);
//             }
//         }
//         document.addEventListener('mousedown', onDocClick);
//         return () => document.removeEventListener('mousedown', onDocClick);
//     }, []);
//
//     useEffect(() => {
//         if (open && highlighted === -1) {
//             const initial = options.findIndex(o => o.value === value);
//             setHighlighted(initial >= 0 ? initial : 0);
//         }
//     }, [open, highlighted, options, value]);
//
//     useEffect(() => {
//         if (open && listRef.current && highlighted >= 0) {
//             const item = listRef.current.children[highlighted] as HTMLElement | undefined;
//             item?.scrollIntoView({ block: 'nearest' });
//         }
//     }, [highlighted, open]);
//
//     const handleToggle = () => setOpen(s => !s);
//
//     const handleSelect = (idx: number) => {
//         const opt = options[idx];
//         if (!opt) return;
//         onChange(opt.value);
//         setOpen(false);
//     };
//
//     const handleKeyDown = (e: React.KeyboardEvent) => {
//         if (e.key === 'ArrowDown') {
//             e.preventDefault();
//             if (!open) setOpen(true);
//             setHighlighted(h => (h + 1) % options.length);
//         } else if (e.key === 'ArrowUp') {
//             e.preventDefault();
//             if (!open) setOpen(true);
//             setHighlighted(h => (h - 1 + options.length) % options.length);
//         } else if (e.key === 'Enter') {
//             e.preventDefault();
//             if (open && highlighted >= 0) handleSelect(highlighted);
//             else setOpen(true);
//         } else if (e.key === 'Escape') {
//             setOpen(false);
//         }
//     };
//
//     const selected = options.find(o => o.value === value) ?? null;
//
//     return (
//         <div ref={rootRef} className={cn('relative w-full text-right', className)}>
//             {label && <label className="block text-sm !mb-1 text-foreground">{label}</label>}
//
//             <div
//                 tabIndex={0}
//                 role="combobox"
//                 aria-controls="select-listbox"
//                 aria-expanded={open}
//                 aria-haspopup="listbox"
//                 aria-label={label ?? 'select'}
//                 onKeyDown={handleKeyDown}
//                 onClick={handleToggle}
//                 className="flex items-center justify-between gap-2 !px-3 !py-2 border !rounded-md shadow-sm bg-white dark:bg-card dark:text-card-foreground border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
//             >
//                 <div className="flex items-center gap-3">
//                     {selected?.icon ? (
//                         typeof selected.icon === 'string' ? (
//                             <img src={selected.icon} alt={selected.label} className="w-6 h-6 object-contain rounded-sm" />
//                         ) : (
//                             <span className="w-6 h-6 flex items-center justify-center">{selected.icon}</span>
//                         )
//                     ) : null}
//
//                     <span className={cn('text-sm', !selected ? 'text-zinc-400' : '')}>
//             {selected ? selected.label : placeholder}
//           </span>
//                 </div>
//
//                 <div className="flex items-center">
//                     {open ? <MdArrowDropUp className="w-6 h-6" /> : <MdArrowDropDown className="w-6 h-6" />}
//                 </div>
//             </div>
//
//             {/* dropdown */}
//             {open && (
//                 <ul
//                     id="select-listbox"
//                     role="listbox"
//                     ref={listRef}
//                     className="absolute z-50 !mt-2 w-full max-h-56 overflow-auto rounded-md border bg-white dark:bg-card dark:text-card-foreground border-gray-200 dark:border-zinc-700 shadow-lg !py-1"
//                 >
//                     {options.map((opt, i) => {
//                         const isSelected = value === opt.value;
//                         const isHighlighted = highlighted === i;
//                         return (
//                             <li
//                                 key={opt.value}
//                                 role="option"
//                                 aria-selected={isSelected}
//                                 onMouseEnter={() => setHighlighted(i)}
//                                 onMouseDown={(e) => {
//                                     // use onMouseDown to avoid blur before click
//                                     e.preventDefault();
//                                     handleSelect(i);
//                                 }}
//                                 className={cn(
//                                     'flex items-center justify-between gap-3 !px-3 !py-2 cursor-pointer text-sm',
//                                     isHighlighted ? 'bg-indigo-50 dark:bg-zinc-700' : 'hover:bg-gray-50 dark:hover:bg-zinc-800'
//                                 )}
//                                 dir="rtl"
//                             >
//                                 <div className="flex items-center gap-3">
//                                     {opt.icon ? (
//                                         typeof opt.icon === 'string' ? (
//                                             <img src={opt.icon} alt={opt.label} className="w-6 h-6 object-contain rounded-sm" />
//                                         ) : (
//                                             <span className="w-6 h-6 flex items-center justify-center">{opt.icon}</span>
//                                         )
//                                     ) : null}
//                                     <span className={cn(isSelected ? 'font-medium' : '')}>{opt.label}</span>
//                                 </div>
//
//                                 {isSelected && <span className="text-indigo-600 dark:text-indigo-300">✔</span>}
//                             </li>
//                         );
//                     })}
//                 </ul>
//             )}
//         </div>
//     );
// }
