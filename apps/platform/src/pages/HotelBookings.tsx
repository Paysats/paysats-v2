import { Link } from "react-router-dom"
import type { FC } from "react"
import { Button } from "@shared-ui/Button"
import { AppLayout } from "@/layouts/AppLayout"
import { SERVICES } from "@shared/constants"
import ComingSoonService from "@/components/app/ComingSoonService"

export const HotelBookings: FC = () => {
    return (
        <ComingSoonService
            serviceName={SERVICES.find(item => item.id === "hotels")?.name || "Hotel Bookings"}
            mainText="Book hotels using Bitcoin Cash, coming soon."
            subText="Paysats is working to bring you comfortable stays worldwide."
        />
    )
}

