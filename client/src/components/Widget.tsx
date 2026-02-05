import clsx from 'clsx';
import { ReactNode } from 'react';

interface WidgetProps {
    children: ReactNode;
    title?: string;
    className?: string;
    action?: ReactNode;
    borderGlow?: boolean;
}

const Widget = ({ children, title, className, action, borderGlow = false }: WidgetProps) => {
    return (
        <div className={clsx(
            "neo-panel neo-panel-hover p-5 flex flex-col",
            borderGlow && "animate-pulse border-neo-alert/50",
            className
        )}>
            {(title || action) && (
                <div className="flex items-center justify-between mb-4">
                    {title && <h3 className="font-orbitron font-bold text-lg text-gray-800 tracking-wide flex items-center gap-2 uppercase">
                        <span className="w-1 h-4 bg-neo-primary rounded-sm shadow-neo" />
                        {title}
                    </h3>}
                    {action}
                </div>
            )}
            <div className="flex-1 relative">
                {children}
            </div>
        </div>
    );
};
export default Widget;
