import logger from "@/utils/logger";
import { PayscribeProvider } from "./providers/payscribe.provider";
import { IAirtimePurchaseParams, IDataPurchaseParams, IFulfillmentResult, IUtilityProvider } from "./providers/base.provider";

export class UtilityService {
    private static providers: Record<string, IUtilityProvider> = {
        PAYSCRIBE: new PayscribeProvider()
    };

    /**
     * Get the active provider (changing to payscribe only for now.... TODO: readd old logic once new provider set up.)
     */
    private static getProvider(): IUtilityProvider {
        return this.providers.PAYSCRIBE;
    }

    static async purchaseAirtime(params: IAirtimePurchaseParams): Promise<IFulfillmentResult> {
        const provider = this.getProvider();
        try {
            logger.info(`Attempting airtime purchase with provider: ${provider.name}`);
            return await provider.purchaseAirtime(params);
        } catch (error: any) {
            logger.error(`Error during airtime purchase with provider: ${provider.name}`, { error: error.message });
            return {
                success: false,
                provider: provider.name,
                failureReason: error.message,
                rawResponse: error
            };
        }
    }

    static async purchaseData(params: IDataPurchaseParams): Promise<IFulfillmentResult> {
        const provider = this.getProvider();
        try {
            logger.info(`Attempting data purchase with provider: ${provider.name}`);
            return await provider.purchaseData(params);
        } catch (error: any) {
            logger.error(`Error during data purchase with provider: ${provider.name}`, { error: error.message });
            return {
                success: false,
                provider: provider.name,
                failureReason: error.message,
                rawResponse: error
            };
        }
    }

    static async getDataPlans(network: string): Promise<any> {
        const provider = this.getProvider();
        try {
            logger.info(`UtilityService: Fetching data plans from provider: ${provider.name} for ${network}`);
            return await provider.getDataPlans(network);
        } catch (error: any) {
            logger.error(`UtilityService: Failed to fetch data plans from ${provider.name}. Error: ${error.message}`);
            throw error;
        }
    }
}
