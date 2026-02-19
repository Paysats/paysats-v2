import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    History,
    Settings,
    LogOut,
    Menu,
    X,
    ShieldCheck,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import { cn } from '@shared/utils/cn';
import { useDashAuthStore } from '../store/dashAuthStore';
import { useUIStore } from '../store/useUIStore';
import { toast } from 'react-next-toast';
import { Button } from '@shared/ui/Button';
import { Logo } from '@shared/ui/Logo';

interface SidebarItemProps {
    to: string;
    icon: React.ElementType;
    label: string;
    active?: boolean;
    isOpen: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon: Icon, label, active, isOpen }) => (
    <Link
        to={to}
        className={cn(
            "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative",
            active
                ? "bg-primary/10 text-primary font-bold shadow-sm shadow-primary/5"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
        )}
    >
        <Icon size={20} className={cn("transition-transform group-hover:scale-110 shrink-0", active && "text-primary")} />
        {isOpen && (
            <span className="text-[15px] tracking-tight whitespace-nowrap overflow-hidden">
                {label}
            </span>
        )}
        {!isOpen && active && (
            <div className="absolute right-0 w-1 h-6 bg-primary rounded-l-full" />
        )}
    </Link>
);

export const DashSidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const logout = useDashAuthStore(state => state.logout);
    const { isSidebarOpen, toggleSidebar } = useUIStore();

    const menuItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dash' },
        { to: '/ledger', icon: History, label: 'Ledger' },
        { to: '/controls', icon: Settings, label: 'Controls' },
    ];

    const handleLogout = () => {
        logout();
        toast.info('Signed out successfully');
        navigate('/login');
    };

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-full bg-card border-r border-border/40 transition-all duration-500 z-50 overflow-hidden shadow-2xl shadow-black/5 flex flex-col",
                isSidebarOpen ? "w-72 translate-x-0" : "w-20 -translate-x-full md:translate-x-0"
            )}
        >
            <div className="flex flex-col h-full p-4">
                <div className="flex items-center justify-between mb-12 min-h-[40px]">
                    <div className={cn(
                        "transition-all duration-500 shrink-0",
                        isSidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none"
                    )}>
                        <Logo withTitle size="medium" />
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className={cn(
                            "rounded-xl hover:bg-secondary shrink-0 transition-transform duration-500",
                            !isSidebarOpen && "md:translate-x-0 translate-x-0"
                        )}
                    >
                        {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
                    </Button>
                </div>

                {/* navigation menu items */}
                <nav className="flex-1 space-y-2">
                    <div className={cn("px-4 mb-6 transition-opacity duration-300", !isSidebarOpen && "opacity-0")}>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.25em] opacity-80 whitespace-nowrap">
                            Dash Operator
                        </p>
                    </div>
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.to}
                            to={item.to}
                            icon={item.icon}
                            label={item.label}
                            isOpen={isSidebarOpen}
                            active={location.pathname === item.to || location.pathname.startsWith(item.to + '/')}
                        />
                    ))}
                </nav>

                {/* Footer Section */}
                <div className="mt-auto space-y-6 pt-6 border-t border-border/40">
                    {isSidebarOpen && (
                        <div className="bg-secondary/30 p-4 rounded-2xl border border-primary/5">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(51,194,121,0.6)]"></div>
                                <span className="text-[10px] font-black text-foreground uppercase tracking-widest">Operator Online</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground transition-opacity duration-500">
                                <ShieldCheck size={14} className="text-primary/70 shrink-0" />
                                <span className="text-[11px] font-medium truncate">Secured by Dash Protocol</span>
                            </div>
                        </div>
                    )}

                    <Button
                        variant="ghost"
                        fullWidth={isSidebarOpen}
                        onClick={handleLogout}
                        className={cn(
                            "group hover:bg-destructive/5! hover:text-destructive! justify-start rounded-xl p-3",
                            !isSidebarOpen && "justify-center"
                        )}
                    >
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform shrink-0" />
                        {isSidebarOpen && <span className="ml-3 font-bold text-[14px] whitespace-nowrap">Terminate Session</span>}
                    </Button>
                </div>
            </div>

            {/* desktop reveal btn (when collapsed) */}
            {!isSidebarOpen && (
                <button
                    onClick={toggleSidebar}
                    className="hidden md:flex absolute inset-0 w-full h-full cursor-pointer hover:bg-primary/5 transition-colors z-[-1]"
                    aria-label="Expand Sidebar"
                />
            )}
        </aside>
    );
};
