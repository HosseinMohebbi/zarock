'use client'

import React from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    name: string
    containerClass?: string
    labelClass?: string
    inputClass?: string
    error?: string
}
export default function Input({
                                  label,
                                  name,
                                  containerClass,
                                  labelClass,
                                  inputClass,
                                  error,
                                  ...props
                              }: InputProps) {
    return (
        <div className={cn('w-full flex flex-col gap-1', containerClass)}>
            {label && (
                <label
                    htmlFor={name}
                    className={cn('!mb-1 text-sm text-foreground font-medium', labelClass)}
                >
                    {label}
                </label>
            )}
            <input
                id={name}
                name={name}
                className={cn(
                    'text-base !px-3 outline-2 outline-border !rounded-lg shadow-[0px_2px_2px_0px_#0000001A] focus:outline-3 dir-rtl',
                    inputClass
                )}
                {...props}
            />

            {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
        </div>
    )
}
