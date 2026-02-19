import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { STORAGE_KEYS, getFromStorage, setInStorage, removeFromStorage } from '@shared/utils/storage';

interface AuthenticatedUser {
    _id: string;
    email: string;
    role: string;
}

interface AdminAuthState {
    admin: AuthenticatedUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, user: AuthenticatedUser) => void;
    logout: () => void;
    initialize: () => void;
}

export const useDashAuthStore = create<AdminAuthState>()(
    persist(
        (set) => ({
            admin: null,
            token: null,
            isAuthenticated: false,
            isLoading: true,

            login: (token: string, user: AuthenticatedUser) => {
                setInStorage(STORAGE_KEYS.ACCESS_TOKEN, token);
                setInStorage(STORAGE_KEYS.USER, user);
                set({
                    token,
                    admin: user,
                    isAuthenticated: true,
                    isLoading: false
                });
            },

            logout: () => {
                removeFromStorage(STORAGE_KEYS.ACCESS_TOKEN);
                removeFromStorage(STORAGE_KEYS.USER);
                set({
                    admin: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false
                });
            },

            initialize: () => {
                const token = getFromStorage<string | null>(STORAGE_KEYS.ACCESS_TOKEN, null);
                const user = getFromStorage<AuthenticatedUser | null>(STORAGE_KEYS.USER, null);

                if (token && user) {
                    set({
                        token,
                        admin: user,
                        isAuthenticated: true,
                        isLoading: false
                    });
                } else {
                    set({ isLoading: false });
                }
            }
        }),
        {
            name: 'admin-auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                admin: state.admin,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
