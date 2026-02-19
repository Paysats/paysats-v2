import { Link } from "react-router-dom"
import { Logo } from "@shared-ui/Logo"
import type { FC } from "react"

export const NotFound: FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">
            <header className="flex justify-center items-center py-8">
                <Logo withTitle />
            </header>
            <main className="flex-grow flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-4 text-center">
                <h1 className="text-[120px] md:text-[180px] font-black text-primary leading-none tracking-tighter mb-4">
                    404
                </h1>

                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Page Not Found
                </h2>

                <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
                    It looks like you've wandered off the path. Don't worry, we'll get you back to where you need to be.
                </p>

                <Link
                    to="/"
                    className="bg-primary hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/20"
                >
                    Back to Paysats Home
                </Link>
            </main>

            <footer className="py-8 text-center">
                <p className="text-[#A0B9B6] text-sm">
                    &copy; {new Date().getFullYear()} PaySats
                </p>
            </footer>
        </div>
    )
}

export default NotFound;
