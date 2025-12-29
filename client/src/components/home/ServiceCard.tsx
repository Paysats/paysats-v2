import { Tooltip } from "antd"
import { Lock, type LucideIcon } from "lucide-react"
import type { FC } from "react"

interface IServiceCard {
    title: string
    icon: LucideIcon
    isActive: boolean
}

export const ServiceCard: FC<IServiceCard> = ({ title, icon: Icon, isActive }) => {
    return (
        <div className="flex flex-col items-center gap-4">
            <div
                className={`
                    w-20 h-20 md:w-24 md:h-24 rounded-lg flex items-center justify-center relative
                    ${isActive ? 'bg-white transition-transform active:scale-95 cursor-pointer hover:shadow-sm' : 'bg-[#E3EEE9]/50 pointer-events-none'}
                    `}
            >
                <Icon
                    size={32}
                    className={isActive ? "text-primary stroke-[2.5]" : "text-[#B5C7C0] stroke-2"}
                />
                {!isActive && (
                    <div className="absolute top-2 right-2">
                        <Lock size={14} className="text-[#B5C7C0]" />
                    </div>
                )}
            
            </div>
            <span className={`text-sm font-semibold tracking-tight ${isActive ? 'text-foreground' : 'text-[#A0B9B6]'}`}>
                {title.charAt(0).toUpperCase() + title.slice(1)}
            </span>
        </div>
    )
}