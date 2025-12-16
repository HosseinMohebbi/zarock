'use client';
import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface CardProps {
    title?: string;
    content?: string;
    icon?: ReactNode;
    children?: ReactNode;
    customStyle?: string;
    key?: string | number;
    onClick?: (id?: string) => void;
}

const Card = ({ title, content, icon, children, customStyle, key, onClick }: CardProps) => {
    return (
        <div
            key={key}
            className={cn(
                'w-full max-w-md flex flex-col justify-center gap-2 rounded-xl bg-card text-card-foreground !p-4 shadow-md transition hover:shadow-lg',
                customStyle
            )}
            onClick={onClick}
        >
            <div className="flex flex-col justify-center items-center gap-3">
                {icon && <div className="w-8 h-8">{icon}</div>}
                {title && <div className="font-semibold text-lg">{title}</div>}
            </div>

            {content && <p className="text-sm text-gray-600 dark:text-gray-300">{content}</p>}

            {children && <div>{children}</div>}
        </div>
    );
};

export default Card;