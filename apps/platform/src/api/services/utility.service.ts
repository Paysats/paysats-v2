import api from '../api';

export interface DataPlan {
    planCode: string;
    name: string;
    amount: number;
    duration?: string;
}

export class UtilityService {
    static async getDataPlans(network: string): Promise<DataPlan[]> {
        const response = await api.get(`/utility/data-plans/${network}`);
        return response.data.data;
    }
}
