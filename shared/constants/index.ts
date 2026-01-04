/**
 * Shared constants used across client and server
 */

export const APP_NAME = 'paysats';
export const APP_DOMAIN = 'paysats.io';
export const APP_URL = `https://${APP_DOMAIN}`;

export const USERNAME_REGEX = /^[a-z0-9_-]{3,30}$/;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;


export const SERVICES = [
    {
        name: "airtime",
        route: "airtime",
        isActive: true
    },
    {
        name: "data",
        route: "data",
        isActive: true
    },
    {
        name: "cable tv",
        route: "cable-tv",
        isActive: false,
    },
    {
        name: "electricity bill",
        route: "electricity-bill",
        isActive: false,
    },
    {
        name: "hotel booking",
        route: "hotel-booking",
        isActive: false,
    },
    {
        name: "flight booking",
        route: "flight-booking",
        isActive: false,
    },
]