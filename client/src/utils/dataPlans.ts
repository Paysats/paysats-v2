import { NetworkProviderEnum } from "./networkProviders";

export interface DataPlanVariation {
    variation_code: string;
    name: string;
    variation_amount: string;
    fixedPrice: "Yes" | "No";
}

export interface DataPlanService {
    ServiceName: string;
    serviceID: string;
    convinience_fee: string;
    variations: DataPlanVariation[];
}

// TODO: delete after implementing api from vtp
// dummy data
export const DATA_PLANS: Record<string, DataPlanVariation[]> = {
    [NetworkProviderEnum.MTN]: [
        { variation_code: "mtn-100mb-100", name: "100MB - 24 hrs", variation_amount: "100.00", fixedPrice: "Yes" },
        { variation_code: "mtn-200mb-200", name: "200MB - 2 days", variation_amount: "200.00", fixedPrice: "Yes" },
        { variation_code: "mtn-2-5gb-600", name: "2.5GB - 2 days", variation_amount: "600.00", fixedPrice: "Yes" },
        { variation_code: "mtn-3gb-800", name: "3GB - 2 days", variation_amount: "800.00", fixedPrice: "Yes" },
        { variation_code: "mtn-1-5gb-1000", name: "1.5GB - 30 days", variation_amount: "1000.00", fixedPrice: "Yes" },
        { variation_code: "mtn-3gb-1500", name: "3GB - 30 days", variation_amount: "1500.00", fixedPrice: "Yes" },
        { variation_code: "mtn-6gb-1500", name: "6GB - 7 days", variation_amount: "1500.00", fixedPrice: "Yes" },
        { variation_code: "mtn-7gb-2000", name: "7GB - 7 days", variation_amount: "2000.00", fixedPrice: "Yes" },
        { variation_code: "mtn-4-5gb-2000", name: "4.5GB - 30 days", variation_amount: "2000.00", fixedPrice: "Yes" },
        { variation_code: "mtn-6gb-2500", name: "6GB - 30 days", variation_amount: "2500.00", fixedPrice: "Yes" },
        { variation_code: "mtn-8gb-3000", name: "8GB - 30 days", variation_amount: "3000.00", fixedPrice: "Yes" },
        { variation_code: "mtn-10gb-3500", name: "10GB - 30 days", variation_amount: "3500.00", fixedPrice: "Yes" },
        { variation_code: "mtn-15gb-5000", name: "15GB - 30 days", variation_amount: "5000.00", fixedPrice: "Yes" },
        { variation_code: "mtn-20gb-6000", name: "20GB - 30 days", variation_amount: "6000.00", fixedPrice: "Yes" },
        { variation_code: "mtn-40gb-10000", name: "40GB - 30 days", variation_amount: "10000.00", fixedPrice: "Yes" },
        { variation_code: "mtn-75gb-15000", name: "75GB - 30 days", variation_amount: "15000.00", fixedPrice: "Yes" },
        { variation_code: "mtn-110gb-20000", name: "110GB - 30 days", variation_amount: "20000.00", fixedPrice: "Yes" },
        { variation_code: "mtn-25gb-sme-10000", name: "25GB SME - 1 Month", variation_amount: "10000.00", fixedPrice: "Yes" },
        { variation_code: "mtn-100gb-20000", name: "100GB - 2 Months", variation_amount: "20000.00", fixedPrice: "Yes" },
        { variation_code: "mtn-120gb-22000", name: "120GB + 80mins - 30 days", variation_amount: "22000.00", fixedPrice: "Yes" },
        { variation_code: "mtn-160gb-30000", name: "160GB - 2 Months", variation_amount: "30000.00", fixedPrice: "Yes" },
        { variation_code: "mtn-165gb-sme-50000", name: "165GB SME - 2 Months", variation_amount: "50000.00", fixedPrice: "Yes" },
        { variation_code: "mtn-400gb-50000", name: "400GB - 3 Months", variation_amount: "50000.00", fixedPrice: "Yes" },
        { variation_code: "mtn-600gb-75000", name: "600GB - 3 Months", variation_amount: "75000.00", fixedPrice: "Yes" },
        { variation_code: "mtn-1tb-100000", name: "1TB - 1 Year", variation_amount: "100000.00", fixedPrice: "Yes" },
        { variation_code: "mtn-360gb-sme-100000", name: "360GB SME - 3 Months", variation_amount: "100000.00", fixedPrice: "Yes" },
        { variation_code: "mtn-4-5tb-450000", name: "4.5TB - 1 Year", variation_amount: "450000.00", fixedPrice: "Yes" },
    ],
    [NetworkProviderEnum.GLO]: [
        { variation_code: "glo-100mb-100", name: "100MB - 1 day", variation_amount: "100.00", fixedPrice: "Yes" },
        { variation_code: "glo-350mb-200", name: "350MB - 2 days", variation_amount: "200.00", fixedPrice: "Yes" },
        { variation_code: "glo-1-6gb-500", name: "1.6GB - 3 days", variation_amount: "500.00", fixedPrice: "Yes" },
        { variation_code: "glo-2-9gb-1000", name: "2.9GB - 30 days", variation_amount: "1000.00", fixedPrice: "Yes" },
        { variation_code: "glo-4-1gb-1500", name: "4.1GB - 30 days", variation_amount: "1500.00", fixedPrice: "Yes" },
        { variation_code: "glo-5-8gb-2000", name: "5.8GB - 30 days", variation_amount: "2000.00", fixedPrice: "Yes" },
        { variation_code: "glo-7-7gb-2500", name: "7.7GB - 30 days", variation_amount: "2500.00", fixedPrice: "Yes" },
        { variation_code: "glo-10gb-3000", name: "10GB - 30 days", variation_amount: "3000.00", fixedPrice: "Yes" },
        { variation_code: "glo-13-25gb-4000", name: "13.25GB - 30 days", variation_amount: "4000.00", fixedPrice: "Yes" },
        { variation_code: "glo-18-25gb-5000", name: "18.25GB - 30 days", variation_amount: "5000.00", fixedPrice: "Yes" },
        { variation_code: "glo-29-5gb-8000", name: "29.5GB - 30 days", variation_amount: "8000.00", fixedPrice: "Yes" },
        { variation_code: "glo-50gb-10000", name: "50GB - 30 days", variation_amount: "10000.00", fixedPrice: "Yes" },
        { variation_code: "glo-93gb-15000", name: "93GB - 30 days", variation_amount: "15000.00", fixedPrice: "Yes" },
        { variation_code: "glo-119gb-18000", name: "119GB - 30 days", variation_amount: "18000.00", fixedPrice: "Yes" },
        { variation_code: "glo-138gb-20000", name: "138GB - 30 days", variation_amount: "20000.00", fixedPrice: "Yes" },
    ],
    [NetworkProviderEnum.Airtel]: [
        { variation_code: "airtel-100mb-100", name: "100MB - 1 day", variation_amount: "100.00", fixedPrice: "Yes" },
        { variation_code: "airtel-300mb-200", name: "300MB - 3 days", variation_amount: "200.00", fixedPrice: "Yes" },
        { variation_code: "airtel-500mb-300", name: "500MB - 30 days", variation_amount: "300.00", fixedPrice: "Yes" },
        { variation_code: "airtel-1gb-350", name: "1GB - 1 day", variation_amount: "350.00", fixedPrice: "Yes" },
        { variation_code: "airtel-1-5gb-1000", name: "1.5GB - 30 days", variation_amount: "1000.00", fixedPrice: "Yes" },
        { variation_code: "airtel-3gb-1500", name: "3GB - 30 days", variation_amount: "1500.00", fixedPrice: "Yes" },
        { variation_code: "airtel-4-5gb-2000", name: "4.5GB - 30 days", variation_amount: "2000.00", fixedPrice: "Yes" },
        { variation_code: "airtel-6gb-2500", name: "6GB - 30 days", variation_amount: "2500.00", fixedPrice: "Yes" },
        { variation_code: "airtel-10gb-3000", name: "10GB - 30 days", variation_amount: "3000.00", fixedPrice: "Yes" },
        { variation_code: "airtel-11gb-3500", name: "11GB - 30 days", variation_amount: "3500.00", fixedPrice: "Yes" },
        { variation_code: "airtel-20gb-5000", name: "20GB - 30 days", variation_amount: "5000.00", fixedPrice: "Yes" },
        { variation_code: "airtel-40gb-10000", name: "40GB - 30 days", variation_amount: "10000.00", fixedPrice: "Yes" },
        { variation_code: "airtel-75gb-15000", name: "75GB - 30 days", variation_amount: "15000.00", fixedPrice: "Yes" },
        { variation_code: "airtel-120gb-20000", name: "120GB - 30 days", variation_amount: "20000.00", fixedPrice: "Yes" },
        { variation_code: "airtel-240gb-30000", name: "240GB - 60 days", variation_amount: "30000.00", fixedPrice: "Yes" },
        { variation_code: "airtel-400gb-50000", name: "400GB - 90 days", variation_amount: "50000.00", fixedPrice: "Yes" },
        { variation_code: "airtel-500gb-60000", name: "500GB - 120 days", variation_amount: "60000.00", fixedPrice: "Yes" },
        { variation_code: "airtel-1tb-100000", name: "1TB - 365 days", variation_amount: "100000.00", fixedPrice: "Yes" },
    ],
    [NetworkProviderEnum["9Mobile"]]: [
        { variation_code: "9mobile-100mb-100", name: "100MB - 7 days", variation_amount: "100.00", fixedPrice: "Yes" },
        { variation_code: "9mobile-650mb-500", name: "650MB - 30 days", variation_amount: "500.00", fixedPrice: "Yes" },
        { variation_code: "9mobile-1-5gb-1000", name: "1.5GB - 30 days", variation_amount: "1000.00", fixedPrice: "Yes" },
        { variation_code: "9mobile-2gb-1200", name: "2GB - 30 days", variation_amount: "1200.00", fixedPrice: "Yes" },
        { variation_code: "9mobile-3gb-1500", name: "3GB - 30 days", variation_amount: "1500.00", fixedPrice: "Yes" },
        { variation_code: "9mobile-4-5gb-2000", name: "4.5GB - 30 days", variation_amount: "2000.00", fixedPrice: "Yes" },
        { variation_code: "9mobile-11gb-4000", name: "11GB - 30 days", variation_amount: "4000.00", fixedPrice: "Yes" },
        { variation_code: "9mobile-15gb-5000", name: "15GB - 30 days", variation_amount: "5000.00", fixedPrice: "Yes" },
        { variation_code: "9mobile-40gb-10000", name: "40GB - 30 days", variation_amount: "10000.00", fixedPrice: "Yes" },
        { variation_code: "9mobile-75gb-15000", name: "75GB - 30 days", variation_amount: "15000.00", fixedPrice: "Yes" },
        { variation_code: "9mobile-100gb-20000", name: "100GB - 100 days", variation_amount: "20000.00", fixedPrice: "Yes" },
    ],
};
