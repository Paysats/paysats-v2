import { Lock, Mail } from "lucide-react"
import { Link } from "react-router-dom"
import { FaXTwitter } from "react-icons/fa6"
import { config } from "@shared/config/config"

export const AppFooter = () => {
    return (
        <footer className="border-t border-border bg-card/30 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Left: Secure Badge */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Lock size={14} className="text-primary" />
                        <span>
                            Secure Payments by{" "}
                            <Link to="/" className="text-primary font-semibold hover:underline">
                                PaySats
                            </Link>
                        </span>
                    </div>

                    {/* Center: Links */}
                    <div className="flex items-center gap-6 text-sm">
                        <Link 
                            to="/app/support" 
                            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                        >
                            <Mail size={14} />
                            Support
                        </Link>
                        <a 
                            href={`https://x.com/${config.app.X_HANDLE}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                        >
                            <FaXTwitter size={14} />
                            @{config.app.X_HANDLE}
                        </a>
                    </div>

                    {/* Right: Copyright */}
                    <div className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Paysats.io
                    </div>
                </div>
            </div>
        </footer>
    )
}