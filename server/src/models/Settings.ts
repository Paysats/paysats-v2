import mongoose, { Document } from 'mongoose';

export interface ISettingsDocument extends Document {
    services: {
        airtime: boolean;
        data: boolean;
        electricity: boolean;
        cable: boolean;
        flights: boolean;
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
        settings = await SettingsModel.create({
            services: {
                airtime: true,
                data: true,
                electricity: true,
                cable: true,
                flights: false
            },
            rates: {
                bchNgn: 1500000, // Example default
                lastUpdated: new Date()
            }
        });
    }
    return settings;
}
