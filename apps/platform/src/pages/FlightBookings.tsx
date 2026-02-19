import type { FC } from "react"
import { SERVICES } from "@shared/constants"
import ComingSoonService from "@/components/app/ComingSoonService"

export const FlightBookings: FC = () => {
    return (
        <ComingSoonService
            serviceName={SERVICES.find(item => item.id === "flights")?.name || "Flight Bookings"}
            mainText="Book flights using Bitcoin Cash, coming soon."
            subText="Paysats is working to bring you the sky."
        />

    )
}

export default FlightBookings;
