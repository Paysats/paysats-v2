import { Link } from "react-router-dom"
import type { FC } from "react"
import { Button } from "@/components/ui/Button"
import { AppLayout } from "@/layouts/AppLayout"
import { SERVICE_ITEMS } from "@/components/app/ServiceTabs"
import ComingSoonService from "@/components/app/ComingSoonService"

export const HotelBookings: FC = () => {
    return (
        <ComingSoonService
            serviceName={SERVICE_ITEMS.find(item => item.route === "hotels")?.name || "Hotel Bookings"}
            mainText="Book hotels using Bitcoin Cash, coming soon."
            subText="Paysats is working to bring you comfortable stays worldwide."
        />
    )
}

