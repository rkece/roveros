import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Map as MapIcon, Activity, FileText, Shield, Power, X } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../hooks/useAuth';
import { RoverIcon } from './RoverIcon';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const location = useLocation();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        { icon: LayoutDashboard, label: 'Control Center', path: '/dashboard' },
        { icon: MapIcon, label: 'Mission Map', path: '/dashboard/map' },
        { icon: Activity, label: 'Telemetry', path: '/dashboard/telemetry' },
        { icon: FileText, label: 'Logs & Analytics', path: '/dashboard/logs' },
        { icon: Shield, label: 'Admin Panel', path: '/dashboard/admin' },
    ];

    const handleDisconnect = () => {
        logout();
        navigate('/auth');
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={clsx(
                    "fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity md:hidden",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            <aside className={clsx(
                "fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-black/90 border-r border-neo-primary/10 backdrop-blur-xl shadow-lg transition-transform duration-300 md:translate-x-0 md:static md:shadow-none",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b border-neo-primary/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neo-primary/20 to-neo-primary/5 flex items-center justify-center border border-neo-primary/20 shadow-neo">
                            <RoverIcon className="w-6 h-6 text-neo-primary" />
                        </div>
                        <h1 className="font-orbitron font-bold text-lg tracking-wider text-white">ROVER<span className="text-neo-primary">OS</span></h1>
                    </div>
                    {/* Close button for mobile */}
                    <button onClick={onClose} className="md:hidden text-neo-muted hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => onClose()} // Close sidebar on mobile when link clicked
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group font-medium",
                                    isActive
                                        ? "bg-neo-primary/10 text-neo-primary border border-neo-primary/20 shadow-sm font-bold"
                                        : "text-neo-muted hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <item.icon className={clsx("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "filter drop-shadow-sm" : "group-hover:text-neo-primary")} />
                                <span className="tracking-wide">{item.label}</span>
                                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neo-primary shadow-[0_0_5px_#0066cc]" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-neo-primary/10 bg-black/20">
                    <div className="mb-4 px-4 py-2 bg-black/40 rounded border border-neo-primary/10 shadow-sm">
                        <div className="text-xs text-neo-muted uppercase tracking-wider mb-1 font-bold">Signal Strength</div>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i <= 3 ? 'bg-neo-secondary shadow-[0_0_5px_rgba(0,255,153,0.5)]' : 'bg-gray-700'}`} />)}
                        </div>
                        <div className="flex justify-between mt-1">
                            <span className="text-xs text-white font-medium">4G LTE</span>
                            <span className="text-xs text-neo-secondary font-bold">Good</span>
                        </div>
                    </div>
                    <button
                        onClick={handleDisconnect}
                        className="flex items-center gap-3 w-full px-4 py-3 text-neo-alert hover:bg-neo-alert/10 rounded-lg transition-colors border border-transparent hover:border-neo-alert/20 font-bold tracking-wide"
                    >
                        <Power className="w-5 h-5" />
                        <span>Disconnect</span>
                    </button>
                </div>
            </aside>
        </>
    );
};
export default Sidebar;
