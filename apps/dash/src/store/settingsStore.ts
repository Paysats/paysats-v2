import { create } from 'zustand';
import { dashService, type ISettings } from '../api/services/dash.service';

interface SettingsState {
    settings: ISettings | null;
    isLoading: boolean;
    error: string | null;
    fetchSettings: () => Promise<void>;
    updateServiceStatus: (serviceType: string, enabled: boolean) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set: any) => ({
    settings: null,
    isLoading: false,
    error: null,

    fetchSettings: async () => {
        set({ isLoading: true, error: null });
        try {
            const settings = await dashService.getSettings();
            set({ settings, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch settings', isLoading: false });
        }
    },

    updateServiceStatus: async (serviceType: string, enabled: boolean) => {
        try {
            const updatedSettings = await dashService.toggleService(serviceType, enabled);
            set({ settings: updatedSettings });
        } catch (error: any) {
            set({ error: error.message || 'Failed to update service' });
            throw error;
        }
    }
}));
