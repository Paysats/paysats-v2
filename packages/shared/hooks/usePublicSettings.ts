import { create } from 'zustand';
import axios from 'axios';
import { useCallback } from 'react';

export interface IPublicSettings {
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
        lastUpdated: string;
    };
}

interface PublicSettingsState {
    settings: IPublicSettings | null;
    isLoading: boolean;
    error: string | null;
    lastFetched: number | null;
    fetchSettings: (apiUrl: string) => Promise<IPublicSettings | null>;
}

// Global store instance
export const useSettingsStore = create<PublicSettingsState>((set, get) => ({
    settings: null,
    isLoading: false,
    error: null,
    lastFetched: null,

    fetchSettings: async (apiUrl: string) => {
        // cache for 5mins
        const now = Date.now();
        const lastFetched = get().lastFetched;
        if (get().settings && lastFetched && (now - lastFetched < 5 * 60 * 1000)) {
            return get().settings;
        }

        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(apiUrl);
            const settings = response.data.data;
            set({
                settings,
                isLoading: false,
                lastFetched: now
            });
            return settings;
        } catch (error: any) {
            console.log({ error })
            const message = error?.response?.data?.message || error.message || 'Failed to fetch settings';
            set({ error: message, isLoading: false });
            return null;
        }
    }
}));

/**
 * Shared hook to access public system settings
 * @param apiUrl - The base URL of the API
 */
export const usePublicSettings = (apiUrl?: string) => {
    const settings = useSettingsStore((state: PublicSettingsState) => state.settings);
    const isLoading = useSettingsStore((state: PublicSettingsState) => state.isLoading);
    const error = useSettingsStore((state: PublicSettingsState) => state.error);
    const fetchSettingsRaw = useSettingsStore((state: PublicSettingsState) => state.fetchSettings);

    const fetchSettings = useCallback(() => {
        if (!apiUrl) {
            console.warn('API URL not provided to usePublicSettings');
            return Promise.resolve(null);
        }
        return fetchSettingsRaw(apiUrl);
    }, [apiUrl, fetchSettingsRaw]);

    return {
        settings,
        isLoading,
        error,
        fetchSettings
    };
};
