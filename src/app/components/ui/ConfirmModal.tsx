'use client'

import React from 'react'

type ConfirmModalProps = {
    isOpen: boolean
    title?: string
    message: string
    onConfirm: () => void
    onCancel: () => void
    confirmText?: string
    cancelText?: string
    dangerColor?: string
}

export default function ConfirmModal({
                                         isOpen,
                                         title = "تایید",
                                         message,
                                         onConfirm,
                                         onCancel,
                                         confirmText = "تایید",
                                         cancelText = "لغو",
                                         dangerColor = "hsl(0, 75%, 50%)"
                                     }: ConfirmModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-card text-foreground !rounded-lg shadow-lg !p-6 w-80 max-w-full text-center sm:w-lg">
                {title && <h3 className="w-full text-lg font-semibold !mb-2">{title}</h3>}
                <p className="!mb-4">{message}</p>
                <div className="flex justify-center gap-3">
                    <button
                        onClick={onCancel}
                        className="!px-4 !py-2 !rounded bg-gray-200 cursor-pointer"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="!px-4 !py-2 !rounded text-white cursor-pointer"
                        style={{backgroundColor: dangerColor}}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}
