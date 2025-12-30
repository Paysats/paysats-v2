import { Header } from "@/components/home/Header"
import { Hero } from "@/components/home/Hero"
import { ServiceGrid } from "@/components/home/ServiceGrid"
import { Footer } from "@/components/home/Footer"

export const Homepage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center max-w-7xl mx-auto w-full px-4">
                <Hero />
                <ServiceGrid />
            </main>
            <Footer />
        </div>
    )
}

