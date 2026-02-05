import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-neo-bg overflow-hidden text-neo-text">
            {/* Sidebar Area */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 min-w-0 relative">
                {/* Background Elements for Dashboard (Light Mode) */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neo-primary/5 rounded-full blur-[120px] pointer-events-none z-0" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neo-secondary/5 rounded-full blur-[100px] pointer-events-none z-0" />

                <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 z-10 relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
