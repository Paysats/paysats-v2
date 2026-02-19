import mongoose, { Document } from 'mongoose';
import { BCHRateService } from '@/services/bchRate.service';

export interface ISettingsDocument extends Document {
    services: {
        airtime: boolean;
        data: boolean;
        electricity: boolean;
        cable: boolean;
        flights: boolean;
        hotels: boolean;
    };
    rates: {
        bchNgn: number;
        lastUpdated: Date;
    };
}

const settingsSchema = new mongoose.Schema<ISettingsDocument>({
    services: {
        airtime: { type: Boolean, default: true },
        data: { type: Boolean, default: true },
        electricity: { type: Boolean, default: true },
        cable: { type: Boolean, default: true },
        flights: { type: Boolean, default: false },
        hotels: { type: Boolean, default: false },
    },
    rates: {
        bchNgn: { type: Number, default: 0 },
        lastUpdated: { type: Date, default: Date.now },
    }
}, {
    timestamps: true
});

export const SettingsModel = mongoose.model<ISettingsDocument>('Settings', settingsSchema);

/**
 * Helper to get or create settings
 */
export async function getSettings() {
    let settings = await SettingsModel.findOne();
    if (!settings) {
        let initialRate = 1500000;
        try {
            initialRate = await BCHRateService.getBCHToNGNRate();
        } catch (error) {
            console.error('Failed to fetch initial BCH rate, using default 1.5M', error);
        }

        settings = await SettingsModel.create({
            services: {
                airtime: true,
                data: true,
                electricity: true,
                cable: true,
                flights: false,
                hotels: false
            },
            rates: {
                bchNgn: initialRate,
                lastUpdated: new Date()
            }
        });
    }
    return settings;
}
