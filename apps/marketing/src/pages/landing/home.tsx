import { Header } from "@/components/home/Header"
import { Hero } from "@/components/home/Hero"
import { ServiceGrid } from "@/components/home/ServiceGrid"
import { RegionalExpansion } from "@/components/home/RegionalExpansion"
import { Footer } from "@/components/home/Footer"

export const Homepage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white relative overflow-hidden">
            {/* Global Background Brilliance */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] opacity-50 animate-pulse" />
                <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[200px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: 'linear-gradient(to right, #888 1px, transparent 1px), linear-gradient(to bottom, #888 1px, transparent 1px)',
                        backgroundSize: '120px 120px'
                    }}
                />
            </div>

            <Header />
            <main className="flex-grow flex flex-col items-center relative z-10 w-full">
                <Hero />
                <div className="w-full">
                    <RegionalExpansion />
                </div>
            </main>
            <Footer />
        </div>
    )
}

