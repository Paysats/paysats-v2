import { Lock, MailQuestion } from "lucide-react"
import { Link } from "react-router-dom"

export const AppFooter = () => {
    return (
        <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
                <Lock size={10} />
                <span>
                    Secure Payments powered by<Link to="/" className="text-primary"> PaySats.</Link>
                </span>
            </div>
            <Link to="/support" className="font-bold flex items-center gap-1">
                <MailQuestion size={15} />
                Support
            </Link>
        </div>
    )
}