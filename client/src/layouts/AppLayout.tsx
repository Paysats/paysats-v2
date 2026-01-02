import { AppFooter } from "@/components/app/AppFooter"
import { AppHeader } from "@/components/app/AppHeader"
import ServiceTabs from "@/components/app/ServiceTabs";

interface AppLayoutProps {
    children: React.ReactNode;
    serviceTabs?: boolean;
}

export const AppLayout = ({ children, serviceTabs = true }: AppLayoutProps) => {
    return (
        <div className="flex flex-col gap-4 mx-auto min-h-screen py-2">
            <AppHeader />
            {serviceTabs &&
                <div className="mx-auto mt-20 my-4">
                    <ServiceTabs />
                </div>
            }
            <main className="w-full md:max-w-4xl mx-auto flex-grow flex flex-col gap-8 p-4 overflow-y-auto">
                {children}
            </main>
            <AppFooter />
        </div>
    )
}