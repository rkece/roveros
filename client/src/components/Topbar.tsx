import { useRef, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Bell, BatteryCharging, User as UserIcon, LogOut, Settings, ChevronDown, Menu } from 'lucide-react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
    onMenuClick: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    return (
        <header className="h-16 border-b border-neo-primary/10 bg-black/40 backdrop-blur-md flex items-center justify-between px-4 md:px-6 z-20 sticky top-0 shadow-sm transition-all">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 -ml-2 text-neo-muted hover:text-white"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neo-secondary animate-pulse" />
                    <span className="text-sm font-orbitron tracking-wider text-neo-secondary drop-shadow-sm font-bold">SYSTEM ONLINE</span>
                </div>
                <div className="h-4 w-px bg-neo-primary/20 hidden md:block" />
                <span className="text-sm text-neo-muted hidden md:block tracking-wide">Rover-X1 Authorization Verified</span>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
                {/* Battery Status */}
                <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full bg-neo-primary/5 border border-neo-primary/10">
                    <BatteryCharging className="w-4 h-4 text-neo-primary" />
                    <div className="flex flex-col items-end leading-none">
                        <span className="text-sm font-bold text-white">84%</span>
                        <span className="text-[10px] text-neo-muted font-bold">SOLAR CHARGING</span>
                    </div>
                </div>

                <button className="relative p-2 text-neo-muted hover:text-neo-primary transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-neo-alert animate-ping" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-neo-alert" />
                </button>

                <div className="relative" ref={menuRef}>
                    <div
                        className="flex items-center gap-3 border-l border-neo-primary/10 pl-4 md:pl-6 cursor-pointer group"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <div className="text-right hidden md:block">
                            <div className="text-sm font-bold text-white group-hover:text-neo-primary transition-colors">
                                {user?.username ? `Unit: ${user.username}` : 'Control Unit'}
                            </div>
                            <div className="text-xs text-neo-muted font-medium">{user?.role === 'admin' ? 'Level 5 Clearance' : 'Level 3 Clearance'}</div>
                        </div>
                        <div className={clsx(
                            "w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-tr from-neo-primary to-neo-primary/60 p-[1px] shadow-sm group-hover:shadow-[0_0_10px_rgba(0,102,204,0.3)] transition-all",
                            menuOpen && "ring-2 ring-neo-primary/20"
                        )}>
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-neo-primary" />
                            </div>
                        </div>
                        <ChevronDown className={clsx("w-4 h-4 text-neo-muted transition-transform duration-300 hidden md:block", menuOpen && "rotate-180")} />
                    </div>

                    {/* Dropdown Menu */}
                    {menuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-neo-panel backdrop-blur-xl rounded-xl shadow-neo border border-neo-primary/20 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-4 py-3 border-b border-neo-primary/10 bg-black/20 block md:hidden">
                                <p className="text-sm font-bold text-white">{user?.username || 'Unit'}</p>
                                <p className="text-xs text-neo-muted truncate">{user?.email}</p>
                            </div>
                            <div className="px-4 py-3 border-b border-neo-primary/10 bg-black/20 hidden md:block">
                                <p className="text-sm font-bold text-white">Operator Profile</p>
                                <p className="text-xs text-neo-muted truncate">{user?.email}</p>
                            </div>
                            <button className="w-full text-left px-4 py-2 text-sm text-neo-text hover:bg-white/5 hover:text-neo-primary flex items-center gap-2 transition-colors">
                                <Settings className="w-4 h-4" /> System Preferences
                            </button>
                            <div className="h-px bg-neo-primary/10 my-1" />
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-neo-alert hover:bg-neo-alert/5 flex items-center gap-2 transition-colors"
                            >
                                <LogOut className="w-4 h-4" /> Disconnect Session
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
export default Topbar;
