
'use client';
import React, { useEffect, useRef } from 'react';
import { MdClose } from "react-icons/md";
import Button from "@/app/components/ui/Button";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: () => void;
    children?: React.ReactNode;
    ariaLabel?: string;
    modalTitle?: string;
}

export default function Modal({ open, onClose, onSubmit, children, ariaLabel = 'Modal', modalTitle }: ModalProps) {
    const dialogRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!open) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', onKey);
        // focus dialog for accessibility
        dialogRef.current?.focus();

        return () => {
            document.removeEventListener('keydown', onKey);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onClose}
            role="presentation"
        >
            <div
                ref={dialogRef}
                className=" w-[92%] max-w-lg flex flex-col bg-background text-foreground  rounded-lg !p-6 shadow-lg outline-none"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={ariaLabel}
                tabIndex={-1}
            >
                <div className="flex justify-between items-center">
                    <button
                        onClick={onClose}
                        aria-label="close"
                        className=" top-3 left-3 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <MdClose className="w-8 h-8 text-white" />
                    </button>
                    <h2 className="text-white">{modalTitle}</h2>
                </div>

                <div>{children}</div>

                <div className="flex justify-start gap-3 mt-4">
                    <Button
                        type="button"
                        label="افزودن"
                        onClick={onSubmit}
                        customStyle="bg-green-600 hover:bg-green-700 !px-4 !py-2 rounded-lg text-white"
                    />
                    <Button
                        type="button"
                        label="لغو"
                        onClick={onClose}
                        customStyle="bg-gray-400 hover:bg-gray-500 !px-4 !py-2 rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
}
