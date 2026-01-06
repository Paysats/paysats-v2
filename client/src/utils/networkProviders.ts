// Import images directly so Vite can process them for production
import mtnLogo from '@/assets/images/network-providers/mtn-logo.svg';
import gloLogo from '@/assets/images/network-providers/glo-logo.svg';
import airtelLogo from '@/assets/images/network-providers/airtel-logo.svg';
import nineMobileLogo from '@/assets/images/network-providers/9mobile-logo.svg';



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