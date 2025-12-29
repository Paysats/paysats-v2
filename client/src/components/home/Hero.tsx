import { Bitcoin } from "lucide-react"
import type { FC } from "react"

export const Hero: FC = () => {
    return (
        <div className="text-center py-12 px-4">
            <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-4 tracking-tight">
                Your everyday with <br /> <span className="text-primary flex items-center justify-center"><Bitcoin className=" text-primary p-0 font-extrabold -mr-5" size={90} />itcoinCash </span> 
                    
            </h1>
            <p className="text-primary-700 text-base font-medium">
                Pay for everyday services like airtime &amp; data instantly using Bitcoin Cash.
            </p>
        </div>
    )
}
