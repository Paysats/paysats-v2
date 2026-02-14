import { config } from "@/config/config";
import logger from "@/utils/logger";
import { VtPassProvider } from "./providers/vtpass.provider";
import { PayscribeProvider } from "./providers/payscribe.provider";
import { IAirtimePurchaseParams, IDataPurchaseParams, IFulfillmentResult, IUtilityProvider } from "./providers/base.provider";

export class UtilityService {
    private static providers: Record<string, IUtilityProvider> = {
        VTPASS: new VtPassProvider(),
        PAYSCRIBE: new PayscribeProvider()
    };

    private static getProvidersInOrder(): IUtilityProvider[] {
        const primary = config.utility.DEFAULT_PROVIDER;
        const secondary = primary === 'VTPASS' ? 'PAYSCRIBE' : 'VTPASS';

        return [
            this.providers[primary],
            this.providers[secondary]
        ];
    }

    static async purchaseAirtime(params: IAirtimePurchaseParams): Promise<IFulfillmentResult> {
        const providers = this.getProvidersInOrder();
        let lastResult: IFulfillmentResult | null = null;

        for (const provider of providers) {
            try {
                logger.info(`Attempting airtime purchase with provider: ${provider.name}`);
                const result = await provider.purchaseAirtime(params);

                if (result.success) {
                    logger.info(`UtilityService: Airtime purchase SUCCESS with provider: ${provider.name}`, { reference: params.reference });
                    return result;
                }

                logger.warn(`UtilityService: Airtime purchase FAILED with provider: ${provider.name}. Reason: ${result.failureReason}. Trying next provider if available...`);
                lastResult = result;
            } catch (error: any) {
                logger.error(`Error during airtime purchase with provider: ${provider.name}`, { error: error.message });
                lastResult = {
                    success: false,
                    provider: provider.name,
                    failureReason: error.message,
                    rawResponse: error
                };
            }
        }

        return lastResult!;
    }

    static async purchaseData(params: IDataPurchaseParams): Promise<IFulfillmentResult> {
        const providers = this.getProvidersInOrder();
        let lastResult: IFulfillmentResult | null = null;

        for (const provider of providers) {
            try {
                logger.info(`Attempting data purchase with provider: ${provider.name}`);
                const result = await provider.purchaseData(params);

                if (result.success) {
                    logger.info(`UtilityService: Data purchase SUCCESS with provider: ${provider.name}`, { reference: params.reference });
                    return result;
                }

                logger.warn(`UtilityService: Data purchase FAILED with provider: ${provider.name}. Reason: ${result.failureReason}. Trying next provider if available...`);
                lastResult = result;
            } catch (error: any) {
                logger.error(`Error during data purchase with provider: ${provider.name}`, { error: error.message });
                lastResult = {
                    success: false,
                    provider: provider.name,
                    failureReason: error.message,
                    rawResponse: error
                };
            }
        }

        return lastResult!;
    }
}
