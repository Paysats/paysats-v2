/**
 * Shared constants used across client and server
 */

export const APP_NAME = 'paysats';
export const APP_DOMAIN = 'trypaysats.xyz';
export const APP_URL = `https://${APP_DOMAIN}`;

export const DOMAIN_URLS = {
    LANDING: import.meta.env.VITE_LANDING_URL || "http://localhost:3000",
    PLATFORM: import.meta.env.VITE_PLATFORM_URL || "http://localhost:3001",
    DASH: import.meta.env.VITE_DASHBOARD_URL || "http://localhost:3002"
}

export const USERNAME_REGEX = /^[a-z0-9_-]{3,30}$/;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;


export const SERVICES = [
    {
        id: "airtime",
        name: "Airtime",
        description: "Instant mobile credit top-up for all networks",
        icon: "Smartphone",
        route: "airtime",
        isActive: true
    },
    {
        id: "data",
        name: "Data Bundles",
        description: "Stay connected with affordable internet packages",
        icon: "Wifi",
        route: "data",
        isActive: true
    },
    {
        id: "electricity",
        name: "Electricity",
        description: "Pay power bills and generate prepaid tokens",
        icon: "Zap",
        route: "electricity",
        isActive: false,
    },
    {
        id: "cable",
        name: "Cable TV",
        description: "Renew your satellite and cable TV subscriptions",
        icon: "Monitor",
        route: "cable-tv",
        isActive: false,
    },
    {
        id: "flights",
        name: "Flights",
        description: "Book domestic and international flights with BCH",
        icon: "Plane",
        route: "flights",
        isActive: false,
    },
    {
        id: "hotels",
        name: "Hotels",
        description: "Reserve accommodations worldwide using crypto",
        icon: "Hotel",
        route: "hotels",
        isActive: false,
    }
]