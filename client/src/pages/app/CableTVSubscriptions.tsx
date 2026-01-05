import { Link } from "react-router-dom"
import type { FC } from "react"
import { Button } from "@/components/ui/Button"
import { AppLayout } from "@/layouts/AppLayout"
import { SERVICE_ITEMS } from "@/components/app/ServiceTabs"
import ComingSoonService from "@/components/app/ComingSoonService"

export const CableTVSubscriptions: FC = () => {
    return (
        <ComingSoonService
            serviceName={SERVICE_ITEMS.find(item => item.route === "cable-tv")?.name || "Cable TV Subscriptions"}
            mainText="Cable subscriptions powered by Bitcoin Cash, coming soon."
            subText="We are working hard to bring decentralized payments to your living room. Stay tuned for updates from Paysats."
        />
    )
}
