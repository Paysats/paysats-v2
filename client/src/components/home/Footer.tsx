import type { FC } from "react"
import { Link } from "react-router-dom"

export const Footer: FC = () => {
    return (
        <footer className="mt-auto pb-6 text-center">
            <p className="text-[#A0B9B6] mb-22 text-sm font-medium tracking-wide">
                Simple. Secure. Stateless.
            </p>
            <div className="flex items-center justify-center gap-8">
                <Link to="/terms" className="text-primary-600">Terms</Link>
                <Link to="/privacy" className="text-primary-600">Privacy</Link>
                <Link to="/support" className="text-primary-600">Support</Link>
            </div>
            <p className="text-secondary-text mt-2 text-sm">
                &copy; {new Date().getFullYear()} PaySats. All rights reserved.
            </p>
        </footer>
    )
}
