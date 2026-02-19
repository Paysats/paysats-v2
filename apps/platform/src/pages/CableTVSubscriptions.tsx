import { Link } from "react-router-dom"
import type { FC } from "react"
import { Button } from "@shared-ui/Button"
import { AppLayout } from "@/layouts/AppLayout"
import { SERVICES } from "@shared/constants"
import ComingSoonService from "@/components/app/ComingSoonService"

export const CableTVSubscriptions: FC = () => {
    return (
        <ComingSoonService
            serviceName={SERVICES.find(item => item.id === "cable")?.name || "Cable TV Subscriptions"}
            mainText="Cable subscriptions powered by Bitcoin Cash, coming soon."
            subText="We are working hard to bring decentralized payments to your living room. Stay tuned for updates from Paysats."
        />
    )
}
