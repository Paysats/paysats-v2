import { Link } from "react-router-dom"
import type { FC } from "react"
import { Button } from "@shared-ui/Button"
import { AppLayout } from "@/layouts/AppLayout"
import { SERVICES } from "@shared/constants"
import ComingSoonService from "@/components/app/ComingSoonService"

export const ElectricityBills: FC = () => {
    return (
        <ComingSoonService
            serviceName={SERVICES.find(item => item.id === "electricity")?.name || "Electricity Bills"}
            mainText="Coming soon — pay electricity bills with BCH."
            subText="We are working hard to bring this service to Paysats."
        />
    )
}

export default ElectricityBills;
