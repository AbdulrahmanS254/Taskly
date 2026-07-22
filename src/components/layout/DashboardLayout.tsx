import { useState } from 'react';
import { Outlet } from 'react-router';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="bg-background min-h-screen">
            <Sidebar
                open={mobileOpen}
                collapsed={collapsed}
                onClose={() => setMobileOpen(false)}
                onToggleCollapse={() => setCollapsed((prev) => !prev)}
            />

            <div
                className={`flex flex-col min-h-screen transition-all duration-200 ${
                    collapsed ? 'md:pl-20' : 'md:pl-64'
                }`}
            >
                <Navbar onMenuClick={() => setMobileOpen(true)} />
                <main className="flex-1 p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}