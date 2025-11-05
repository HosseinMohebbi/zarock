'use client';
import React, { useEffect, useRef } from 'react';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    ariaLabel?: string;
}

export default function Modal({ open, onClose, children, ariaLabel = 'Modal' }: ModalProps) {
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
                className="relative w-[92%] max-w-lg bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg outline-none"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={ariaLabel}
                tabIndex={-1}
            >
                <button
                    onClick={onClose}
                    aria-label="close"
                    className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    ×
                </button>

                <div>{children}</div>
            </div>
        </div>
    );
}
