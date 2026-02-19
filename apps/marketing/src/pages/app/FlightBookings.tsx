import { Link } from "react-router-dom"
import type { FC } from "react"
import { Button } from "@shared-ui/Button"
import { AppLayout } from "@/layouts/AppLayout"
import { SERVICE_ITEMS } from "@/components/app/ServiceTabs"
import ComingSoonService from "@/components/app/ComingSoonService"

export const FlightBookings: FC = () => {
    return (
        <ComingSoonService
            serviceName={SERVICE_ITEMS.find(item => item.route === "flights")?.name || "Flight Bookings"}
            mainText="Book flights using Bitcoin Cash, coming soon."
            subText="Paysats is working to bring you the sky."
        />
        
    )
}

export default FlightBookings;
