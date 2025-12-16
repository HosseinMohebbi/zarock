import { cn } from '@/utils/cn'

type ButtonProps = {
    label?: React.ReactNode;
    onClick?: () => void;
    customStyle?: string;
    type?: 'button' | 'submit';
    icon?: {
        src: string;
        alt?: string;
        iconStyle?: string;
    };
    disabled?: boolean;
};

const Button = ({
                    label,
                    onClick,
                    customStyle,
                    type = 'button',
                    icon,
                    disabled = false,
                }: ButtonProps) => {
    return (
        <>
            <button
                disabled={disabled}
                type={type}
                onClick={onClick}
                className={cn(
                    'flex gap-2 justify-center items-center !bg-confirm text-foreground text-[20px] font-bold !rounded-lg !py-[5px] !px-[26px] text-lg border border-[#CBCBCB] shadow-[0px_2px_2px_0px_#0000001A] cursor-pointer',
                    customStyle,
                    disabled ? 'bg-gray-500' : ''
                )}
            >
                {icon && (
                    <img
                        src={icon.src}
                        alt={icon.alt || ''}
                        className={cn('h-5 w-5', icon.iconStyle)}
                    />
                )}
                {label}
            </button>
        </>
    );
};

export default Button;
