import {ReactNode} from 'react';
import {cn} from '@/utils/cn'


interface CardProps {
    title?: string;
    content?: string;
    // iconSrc?: string;
    // icon?: {
    //     src: string;
    //     alt?: string;
    //     iconStyle?: string;
    // };
    icon?: ReactNode;
    customStyle?: string;
}

const Card = ({title, content, icon, customStyle}: CardProps) => {
    return <div
        className={cn('w-80 h-32 flex flex-col justify-center items-center rounded-xl bg-red-400 shadow-xl', customStyle)}>
        {icon && <div className="w-8 h-8">{icon}</div>}
        <div>{title}</div>
        This is a Card component.
    </div>;
};

export default Card;