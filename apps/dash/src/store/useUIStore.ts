import { create } from 'zustand';

interface UIState {
    isSidebarOpen: boolean;
    isMobileMenuOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (isOpen: boolean) => void;
    toggleMobileMenu: () => void;
    setMobileMenuOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set: any) => ({
    isSidebarOpen: true,
    isMobileMenuOpen: false,
    toggleSidebar: () => set((state: any) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (isOpen: boolean) => set({ isSidebarOpen: isOpen }),
    toggleMobileMenu: () => set((state: any) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
    setMobileMenuOpen: (isOpen: boolean) => set({ isMobileMenuOpen: isOpen }),
}));
