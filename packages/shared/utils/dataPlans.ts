import { NetworkProviderEnum } from "@shared/types/network-provider.types"

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

