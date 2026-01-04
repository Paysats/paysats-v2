// Import images directly so Vite can process them for production
import mtnLogo from '@/assets/images/network-providers/mtn-logo.jpg';
import gloLogo from '@/assets/images/network-providers/glo-logo.webp';
import airtelLogo from '@/assets/images/network-providers/airtel-logo.svg';
import nineMobileLogo from '@/assets/images/network-providers/9mobile-logo.png';

export enum NetworkProviderEnum {
    MTN = "mtn",
    GLO = "glo",
    Airtel = "airtel",
    "9Mobile" = "9mobile",
}

export const NETWORK_PROVIDERS:{ name: string, logo: string }[] = [
    {
        name: "MTN",
        logo: mtnLogo,
    },
    {
        name: "GLO",
        logo: gloLogo,
    },
    {
        name: "Airtel",
        logo: airtelLogo,
    },
    {
        name: "9Mobile",
        logo: nineMobileLogo,
    },
]